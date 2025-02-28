/**
 * Contrôleur pour gérer les paiements
 */
import { v4 as uuidv4 } from 'uuid';
import { createPaymentIntent as createStripePaymentIntent, confirmPayment as confirmStripePayment } from '../services/stripeService.js';
import { sendOrderConfirmation } from '../services/emailService.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * Crée une intention de paiement
 * @route POST /api/payments/create-intent
 */
const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, customerInfo } = req.body;
    
    // Validation des données
    if (!amount || amount <= 0) {
      throw new ApiError(400, 'Montant invalide');
    }
    
    if (!customerInfo || !customerInfo.email) {
      throw new ApiError(400, 'Informations client incomplètes');
    }
    
    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ email: customerInfo.email });
    
    // Si l'utilisateur n'existe pas, le créer
    if (!user) {
      user = await User.create({
        email: customerInfo.email,
        name: customerInfo.name,
        address: {
          street: customerInfo.address,
          city: customerInfo.city,
          postalCode: customerInfo.postalCode,
          country: customerInfo.country
        }
      });
    }
    
    // Créer l'intention de paiement via Stripe
    const paymentIntent = await createStripePaymentIntent(amount, customerInfo);
    
    // Si l'utilisateur n'a pas d'ID client Stripe, le mettre à jour
    if (!user.stripeCustomerId && paymentIntent.customerId) {
      user.stripeCustomerId = paymentIntent.customerId;
      await user.save();
    }
    
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.paymentIntentId
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Confirme un paiement et crée une commande
 * @route POST /api/payments/confirm
 */
const confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId, customerInfo, items } = req.body;
    
    if (!paymentIntentId) {
      throw new ApiError(400, 'ID d\'intention de paiement manquant');
    }
    
    // Vérifier le statut du paiement
    const paymentResult = await confirmStripePayment(paymentIntentId);
    
    if (!paymentResult.success) {
      throw new ApiError(400, paymentResult.message || 'Échec de la confirmation du paiement');
    }
    
    // Créer une commande
    const orderId = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;
    const orderDate = new Date();
    const amount = paymentResult.paymentIntent.amount;
    
    // Enregistrer la commande dans MongoDB
    const order = await Order.create({
      orderId,
      date: orderDate,
      amount,
      customerInfo,
      items,
      paymentIntentId,
      status: 'confirmed'
    });
    
    // Envoyer un email de confirmation
    sendOrderConfirmation({
      orderId,
      amount,
      customerInfo,
      items
    }).catch(err => console.error('Erreur envoi email:', err));
    
    res.status(200).json({
      success: true,
      orderId,
      orderDate: orderDate.toISOString(),
      message: 'Paiement confirmé et commande créée'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupère les commandes d'un utilisateur
 * @route GET /api/orders/:email
 */
const getUserOrders = async (req, res, next) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      throw new ApiError(400, 'Email requis');
    }
    
    // Récupérer les commandes depuis MongoDB
    const orders = await Order.find({ 'customerInfo.email': email })
      .sort({ date: -1 })
      .exec();
    
    // Formater les commandes pour l'API
    const formattedOrders = orders.map(order => order.toPublicJSON());
    
    res.status(200).json(formattedOrders);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupère une commande par son ID
 * @route GET /api/orders/id/:orderId
 */
const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      throw new ApiError(400, 'ID de commande requis');
    }
    
    const order = await Order.findOne({ orderId }).exec();
    
    if (!order) {
      throw new ApiError(404, 'Commande non trouvée');
    }
    
    res.status(200).json(order.toPublicJSON());
  } catch (error) {
    next(error);
  }
};

export { createPaymentIntent, confirmPayment, getUserOrders, getOrderById };