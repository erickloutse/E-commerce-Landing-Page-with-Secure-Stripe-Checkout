/**
 * Routes pour les commandes
 */
import express from 'express';
import { getUserOrders, getOrderById } from '../controllers/paymentController.js';

const router = express.Router();

// Route pour récupérer les commandes d'un utilisateur
router.get('/:email', getUserOrders);

// Route pour récupérer une commande par son ID
router.get('/id/:orderId', getOrderById);

export default router;