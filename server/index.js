/**
 * Serveur principal de l'application
 */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Configuration pour les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importer les modules
import config from './config/index.js';
import connectDB from './database/index.js';
import applySecurityMiddleware from './middleware/security.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Routes
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Connexion à MongoDB
connectDB();

// Initialiser l'application Express
const app = express();

// Appliquer les middlewares de sécurité
applySecurityMiddleware(app);

// Parser le corps des requêtes
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));

// Servir les fichiers statiques en production
if (config.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Routes API
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API opérationnelle',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connectée' : 'déconnectée'
  });
});

// Gérer les routes non trouvées
app.use(notFoundHandler);

// Gérer les erreurs
app.use(errorHandler);

// Servir l'application React en production
if (config.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Démarrer le serveur
const server = app.listen(config.PORT, () => {
  console.log(`Serveur démarré en mode ${config.NODE_ENV} sur le port ${config.PORT}`);
});

// Gérer les erreurs non capturées
process.on('unhandledRejection', (err) => {
  console.error('ERREUR NON GÉRÉE! 💥 Arrêt du serveur...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

export default app;