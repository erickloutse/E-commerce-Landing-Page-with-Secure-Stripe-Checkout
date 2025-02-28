/**
 * Modèle de données pour les utilisateurs
 */
import mongoose from 'mongoose';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Format d\'email invalide']
  },
  name: {
    type: String,
    required: [true, 'Nom est requis'],
    trim: true
  },
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  stripeCustomerId: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
}, {
  timestamps: true
});

// Méthode pour formater l'utilisateur pour l'API
UserSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    role: this.role
  };
};

const User = mongoose.model('User', UserSchema);

export default User;