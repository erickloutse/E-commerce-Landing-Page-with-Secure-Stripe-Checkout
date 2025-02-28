/**
 * Routes pour les paiements
 */
import express from 'express';
import { createPaymentIntent, confirmPayment } from '../controllers/paymentController.js';

const router = express.Router();

// Route pour créer une intention de paiement
router.post('/create-intent', createPaymentIntent);

// Route pour confirmer un paiement
router.post('/confirm', confirmPayment);

export default router;