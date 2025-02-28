import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Check,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { createPaymentIntent, confirmPayment } from "../api/stripeApi";

// Schéma de validation Zod pour le formulaire d'expédition
const shippingSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lastName: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Adresse email invalide" }),
  address: z.string().min(5, { message: "Adresse requise" }),
  city: z.string().min(2, { message: "Ville requise" }),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, { message: "Code postal invalide (5 chiffres)" }),
  country: z
    .string()
    .length(2, { message: "Code pays invalide (2 caractères)" }),
});

// Schéma de validation pour le formulaire de paiement
const paymentSchema = z.object({
  cardName: z.string().min(3, { message: "Nom sur la carte requis" }),
});

// Clé publique Stripe depuis les variables d'environnement
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

// Étapes du processus de paiement
enum CheckoutStep {
  CART,
  SHIPPING,
  PAYMENT,
  CONFIRMATION,
}

// Composant pour le formulaire de paiement Stripe
const CheckoutForm = ({
  formData,
  items,
  totalPrice,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: formData.cardName || "",
    },
  });

  const handlePaymentSubmit = async (data) => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setCardError("");

    try {
      // Préparer les informations client
      const customerInfo = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country, // Déjà en code ISO à deux caractères
      };

      // 1. Créer une intention de paiement
      const amountInCents = Math.round(totalPrice * 100);
      const paymentIntentResponse = await createPaymentIntent(
        amountInCents,
        customerInfo
      );

      if (
        !paymentIntentResponse.success ||
        !paymentIntentResponse.clientSecret
      ) {
        throw new Error(
          paymentIntentResponse.message ||
            "Erreur lors de la création de l'intention de paiement"
        );
      }

      // 2. Confirmer le paiement avec Stripe.js
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Impossible de trouver l'élément de carte");
      }

      const { error: confirmError } = await stripe.confirmCardPayment(
        paymentIntentResponse.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: data.cardName,
              email: formData.email,
              address: {
                line1: formData.address,
                city: formData.city,
                postal_code: formData.postalCode,
                country: formData.country, // Déjà en code ISO à deux caractères
              },
            },
          },
        }
      );

      if (confirmError) {
        throw confirmError;
      }

      // 3. Confirmer la commande côté serveur
      const confirmationResponse = await confirmPayment(
        paymentIntentResponse.paymentIntentId,
        customerInfo,
        items
      );

      if (!confirmationResponse.success) {
        throw new Error(
          confirmationResponse.message ||
            "Erreur lors de la confirmation de la commande"
        );
      }

      // Succès du paiement
      onPaymentSuccess({
        orderId: confirmationResponse.orderId,
        orderDate: confirmationResponse.orderDate,
      });
    } catch (err) {
      console.error("Erreur de paiement:", err);
      setCardError(
        err.message || "Une erreur est survenue lors du traitement du paiement"
      );
      onPaymentError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handlePaymentSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="cardName"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Nom sur la carte
        </label>
        <input
          type="text"
          id="cardName"
          {...register("cardName")}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        {errors.cardName && (
          <p className="mt-1 text-sm text-red-600">{errors.cardName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Informations de carte
        </label>
        <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
        {cardError && <p className="mt-1 text-sm text-red-600">{cardError}</p>}
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
          alt="Visa"
          className="h-6"
        />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
          alt="Mastercard"
          className="h-6"
        />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
          alt="PayPal"
          className="h-6"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full btn btn-primary flex items-center justify-center"
          disabled={isProcessing || !stripe}
        >
          {isProcessing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Traitement en cours...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Payer {totalPrice.toFixed(2)} €
            </>
          )}
        </button>
      </div>
    </form>
  );
};

const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    totalItems,
    totalPrice,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCartStore();
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>(
    CheckoutStep.CART
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "FR", // Déjà en code ISO à deux caractères
    cardName: "",
  });
  const [paymentError, setPaymentError] = useState("");
  const [orderConfirmation, setOrderConfirmation] = useState({
    orderId: "",
    orderDate: "",
  });

  // Configuration de React Hook Form avec Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shippingSchema),
    defaultValues: formData,
  });

  const handleProceedToCheckout = () => {
    setCheckoutStep(CheckoutStep.SHIPPING);
  };

  const handleShippingSubmit = (data) => {
    setFormData({ ...formData, ...data });
    setCheckoutStep(CheckoutStep.PAYMENT);
  };

  const handlePaymentSuccess = (orderData) => {
    setOrderConfirmation({
      orderId:
        orderData.orderId || `ORD-${Math.floor(Math.random() * 1000000)}`,
      orderDate: orderData.orderDate || new Date().toISOString(),
    });

    setCheckoutStep(CheckoutStep.CONFIRMATION);
  };

  const handlePaymentError = (errorMessage) => {
    setPaymentError(errorMessage);
  };

  const handleFinishOrder = () => {
    clearCart();
    setCheckoutStep(CheckoutStep.CART);
    closeCart();
  };

  const handleBackToCart = () => {
    setCheckoutStep(CheckoutStep.CART);
  };

  const handleBackToShipping = () => {
    setCheckoutStep(CheckoutStep.SHIPPING);
  };

  const renderCartContent = () => (
    <>
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Votre panier est vide
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400 font-medium">
                    {item.price.toFixed(2)} €
                  </p>

                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                      aria-label="Diminuer la quantité"
                    >
                      <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <span className="mx-2 w-8 text-center text-gray-800 dark:text-gray-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                      aria-label="Augmenter la quantité"
                    >
                      <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  aria-label="Supprimer l'article"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-300">Sous-total</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {totalPrice.toFixed(2)} €
            </span>
          </div>
          <div className="flex justify-between mb-6">
            <span className="text-gray-600 dark:text-gray-300">Livraison</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              Gratuite
            </span>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="w-full btn btn-primary flex items-center justify-center"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Procéder au paiement
          </button>
        </div>
      )}
    </>
  );

  const renderShippingForm = () => (
    <div className="flex-1 overflow-y-auto p-4">
      <button
        onClick={handleBackToCart}
        className="flex items-center text-primary-600 dark:text-primary-400 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Retour au panier
      </button>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Informations de livraison
      </h3>

      <form onSubmit={handleSubmit(handleShippingSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Prénom
            </label>
            <input
              type="text"
              id="firstName"
              {...register("firstName")}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nom
            </label>
            <input
              type="text"
              id="lastName"
              {...register("lastName")}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Adresse
          </label>
          <input
            type="text"
            id="address"
            {...register("address")}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">
              {errors.address.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Ville
            </label>
            <input
              type="text"
              id="city"
              {...register("city")}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Code postal
            </label>
            <input
              type="text"
              id="postalCode"
              {...register("postalCode")}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {errors.postalCode && (
              <p className="mt-1 text-sm text-red-600">
                {errors.postalCode.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Pays
          </label>
          <select
            id="country"
            {...register("country")}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="FR">France</option>
            <option value="BE">Belgique</option>
            <option value="CH">Suisse</option>
            <option value="CA">Canada</option>
          </select>
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">
              {errors.country.message}
            </p>
          )}
        </div>

        <div className="pt-4">
          <button type="submit" className="w-full btn btn-primary">
            Continuer vers le paiement
          </button>
        </div>
      </form>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="flex-1 overflow-y-auto p-4">
      <button
        onClick={handleBackToShipping}
        className="flex items-center text-primary-600 dark:text-primary-400 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Retour à la livraison
      </button>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Informations de paiement
      </h3>

      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">Total</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {totalPrice.toFixed(2)} €
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Livraison vers: {formData.address}, {formData.city},{" "}
          {formData.postalCode}, {formData.country}
        </div>
      </div>

      {paymentError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {paymentError}
        </div>
      )}

      <Elements stripe={stripePromise}>
        <CheckoutForm
          formData={formData}
          items={items}
          totalPrice={totalPrice}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      </Elements>
    </div>
  );

  const renderConfirmation = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
        <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Commande confirmée !
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        Merci pour votre achat, {formData.firstName}. Votre commande a été
        confirmée et sera expédiée sous 24h.
      </p>
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg w-full max-w-sm mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Numéro de commande:{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {orderConfirmation.orderId}
          </span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Date:{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {new Date(orderConfirmation.orderDate).toLocaleDateString("fr-FR")}
          </span>
        </p>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
        Un email de confirmation a été envoyé à {formData.email}
      </p>
      <button onClick={handleFinishOrder} className="btn btn-primary">
        Continuer mes achats
      </button>
    </div>
  );

  const renderEmptyCart = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <ShoppingBag className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
        Votre panier est vide
      </p>
      <button onClick={closeCart} className="btn btn-primary">
        Continuer mes achats
      </button>
    </div>
  );

  const renderContent = () => {
    if (items.length === 0 && checkoutStep === CheckoutStep.CART) {
      return renderEmptyCart();
    }

    switch (checkoutStep) {
      case CheckoutStep.CART:
        return renderCartContent();
      case CheckoutStep.SHIPPING:
        return renderShippingForm();
      case CheckoutStep.PAYMENT:
        return renderPaymentForm();
      case CheckoutStep.CONFIRMATION:
        return renderConfirmation();
      default:
        return renderCartContent();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeCart}
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {checkoutStep === CheckoutStep.CART &&
                  `Votre Panier (${totalItems})`}
                {checkoutStep === CheckoutStep.SHIPPING && "Livraison"}
                {checkoutStep === CheckoutStep.PAYMENT && "Paiement"}
                {checkoutStep === CheckoutStep.CONFIRMATION && "Confirmation"}
              </h2>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Fermer le panier"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {renderContent()}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
