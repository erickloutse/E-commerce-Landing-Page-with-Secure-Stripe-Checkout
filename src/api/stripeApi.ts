import axios from 'axios';

// URL de base de l'API (à ajuster selon l'environnement)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Interface pour les informations client
export interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// Interface pour les articles du panier
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Interface pour la réponse de création d'intention de paiement
export interface PaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  message?: string;
}

// Interface pour la réponse de confirmation de paiement
export interface PaymentConfirmationResponse {
  success: boolean;
  orderId?: string;
  orderDate?: string;
  message?: string;
}

// Interface pour une commande
export interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: CartItem[];
}

/**
 * Crée une intention de paiement
 */
export const createPaymentIntent = async (
  amount: number,
  customerInfo: CustomerInfo
): Promise<PaymentIntentResponse> => {
  try {
    const response = await axios.post<PaymentIntentResponse>(
      `${API_URL}/payments/create-intent`,
      { amount, customerInfo }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as PaymentIntentResponse;
    }
    return {
      success: false,
      message: "Une erreur est survenue lors de la communication avec le serveur."
    };
  }
};

/**
 * Confirme un paiement et crée une commande
 */
export const confirmPayment = async (
  paymentIntentId: string,
  customerInfo: CustomerInfo,
  items: CartItem[]
): Promise<PaymentConfirmationResponse> => {
  try {
    const response = await axios.post<PaymentConfirmationResponse>(
      `${API_URL}/payments/confirm`,
      { paymentIntentId, customerInfo, items }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as PaymentConfirmationResponse;
    }
    return {
      success: false,
      message: "Une erreur est survenue lors de la confirmation du paiement."
    };
  }
};

/**
 * Récupère les commandes d'un utilisateur
 */
export const getUserOrders = async (email: string): Promise<Order[]> => {
  try {
    const response = await axios.get<Order[]>(`${API_URL}/orders/${email}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return [];
  }
};