/**
 * Configuration centralisée du serveur
 * Charge les variables d'environnement et fournit une configuration sécurisée
 */
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Validation des variables d'environnement critiques
const requiredEnvVars = [
  'NODE_ENV',
  'MONGODB_URI',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'JWT_SECRET'
];

// Vérifier les variables d'environnement requises
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.warn(`⚠️ Variable d'environnement manquante: ${varName}`);
  }
});

const config = {
  // Environnement
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  
  // Base de données
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/produitpremium',
  
  // Sécurité
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  
  // Stripe
  STRIPE: {
    SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    CURRENCY: 'eur'
  },
  
  // Email
  EMAIL: {
    HOST: process.env.EMAIL_HOST,
    PORT: parseInt(process.env.EMAIL_PORT || '587', 10),
    SECURE: process.env.EMAIL_SECURE === 'true',
    USER: process.env.EMAIL_USER,
    PASS: process.env.EMAIL_PASS,
    FROM: process.env.EMAIL_FROM || 'noreply@produitpremium.com'
  },
  
  // Limites de rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100 // Nombre maximum de requêtes par fenêtre
  }
};

export default config;