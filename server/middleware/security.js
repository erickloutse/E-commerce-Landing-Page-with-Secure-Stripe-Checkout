/**
 * Middleware de sécurité pour l'application
 */
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import config from '../config/index.js';

// Configuration CORS sécurisée
const corsOptions = {
  origin: config.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 heures en secondes
};

// Limiteur de taux de requêtes
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT.WINDOW_MS,
  max: config.RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard'
  }
});

// Appliquer les middlewares de sécurité
const applySecurityMiddleware = (app) => {
  // Protection des en-têtes HTTP
  app.use(helmet());
  
  // Protection contre les attaques XSS
  app.use(xss());
  
  // Protection contre la pollution des paramètres HTTP
  app.use(hpp());
  
  // Configuration CORS
  app.use(cors(corsOptions));
  
  // Limiter les requêtes API
  app.use('/api', limiter);
  
  // Désactiver l'en-tête X-Powered-By
  app.disable('x-powered-by');
  
  return app;
};

export default applySecurityMiddleware;