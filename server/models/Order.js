/**
 * Modèle de données pour les commandes
 */
import mongoose from 'mongoose';

// Schéma pour les articles de la commande
const OrderItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    required: true
  }
});

// Schéma pour les informations client
const CustomerInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
});

// Schéma principal pour les commandes
const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'confirmed'
  },
  customerInfo: {
    type: CustomerInfoSchema,
    required: true
  },
  items: {
    type: [OrderItemSchema],
    required: true
  },
  paymentIntentId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Créer un index pour améliorer les performances des requêtes
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ 'customerInfo.email': 1 });
OrderSchema.index({ date: -1 });

// Méthode pour calculer le total de la commande
OrderSchema.methods.calculateTotal = function() {
  return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Méthode pour formater la commande pour l'API
OrderSchema.methods.toPublicJSON = function() {
  return {
    id: this.orderId,
    date: this.date,
    status: this.status,
    total: this.amount / 100, // Convertir les centimes en euros
    items: this.items
  };
};

const Order = mongoose.model('Order', OrderSchema);

export default Order;