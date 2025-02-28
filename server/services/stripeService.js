import Stripe from "stripe";
import config from "../config/index.js";
import { ApiError } from "../middleware/errorHandler.js";

// Initialiser Stripe avec la clé secrète
const stripeClient = new Stripe(config.STRIPE.SECRET_KEY);

// Fonction pour obtenir le code pays ISO
const getCountryCode = (countryName) => {
  const countryCodes = {
    France: "FR",
    Belgique: "BE",
    Suisse: "CH",
    Canada: "CA",
  };
  return countryCodes[countryName] || "FR"; // Retourne 'FR' par défaut si le pays n'est pas trouvé
};

/**
 * Crée une intention de paiement Stripe
 * @param {number} amount - Montant en centimes
 * @param {Object} customerInfo - Informations du client
 * @returns {Promise<Object>} - Intention de paiement
 */
const createPaymentIntent = async (amount, customerInfo) => {
  try {
    const customer = await createOrRetrieveCustomer(customerInfo);

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount,
      currency: config.STRIPE.CURRENCY,
      customer: customer.id,
      metadata: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
      },
      receipt_email: customerInfo.email,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      customerId: customer.id,
    };
  } catch (error) {
    console.error("Erreur Stripe:", {
      message: error.message,
      code: error.code,
      type: error.type,
      stack: error.stack,
    });
    throw new ApiError(
      400,
      error.message || "Erreur lors de la création du paiement"
    );
  }
};

/**
 * Crée ou récupère un client Stripe
 * @param {Object} customerInfo - Informations du client
 * @returns {Promise<Object>} - Client Stripe
 */
const createOrRetrieveCustomer = async (customerInfo) => {
  try {
    const searchResult = await stripeClient.customers.search({
      query: `email:\'${customerInfo.email}\'`,
    });

    const countryCode = getCountryCode(customerInfo.country);

    if (searchResult.data.length > 0) {
      return await stripeClient.customers.update(searchResult.data[0].id, {
        name: customerInfo.name,
        address: {
          line1: customerInfo.address,
          city: customerInfo.city,
          postal_code: customerInfo.postalCode,
          country: countryCode,
        },
      });
    }

    return await stripeClient.customers.create({
      email: customerInfo.email,
      name: customerInfo.name,
      address: {
        line1: customerInfo.address,
        city: customerInfo.city,
        postal_code: customerInfo.postalCode,
        country: countryCode,
      },
    });
  } catch (error) {
    console.error("Erreur création client Stripe:", {
      message: error.message,
      code: error.code,
      type: error.type,
      stack: error.stack,
    });
    throw new ApiError(400, "Erreur lors de la création du client");
  }
};

/**
 * Confirme un paiement Stripe
 * @param {string} paymentIntentId - ID de l'intention de paiement
 * @returns {Promise<Object>} - Résultat de la confirmation
 */
const confirmPayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripeClient.paymentIntents.retrieve(
      paymentIntentId
    );

    if (paymentIntent.status === "succeeded") {
      return {
        success: true,
        paymentIntent,
      };
    }

    return {
      success: false,
      status: paymentIntent.status,
      message: "Le paiement n'a pas été confirmé",
    };
  } catch (error) {
    console.error("Erreur confirmation paiement:", {
      message: error.message,
      code: error.code,
      type: error.type,
      stack: error.stack,
    });
    throw new ApiError(400, "Erreur lors de la confirmation du paiement");
  }
};

export { createPaymentIntent, confirmPayment, createOrRetrieveCustomer };
