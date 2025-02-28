/**
 * Configuration et connexion à la base de données MongoDB
 */
import mongoose from 'mongoose';
import config from '../config/index.js';

// Options de connexion MongoDB
const mongooseOptions = {
  autoIndex: config.NODE_ENV !== 'production', // Désactiver l'indexation automatique en production
};

// Fonction pour connecter à MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI, mongooseOptions);
    
    console.log(`MongoDB connecté: ${conn.connection.host}`);
    
    // Gérer les erreurs après la connexion initiale
    mongoose.connection.on('error', (err) => {
      console.error(`Erreur MongoDB: ${err}`);
    });
    
    // Gérer la déconnexion
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB déconnecté, tentative de reconnexion...');
    });
    
    // Gérer la fermeture de l'application
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Connexion MongoDB fermée suite à l\'arrêt de l\'application');
      process.exit(0);
    });
    
    return conn;
  } catch (error) {
    console.error(`Erreur de connexion à MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;