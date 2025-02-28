/**
 * Service pour gérer l'envoi d'emails
 */
import nodemailer from 'nodemailer';
import config from '../config/index.js';
import { ApiError } from '../middleware/errorHandler.js';

// Créer un transporteur email
const createTransporter = () => {
  // Vérifier que les informations de configuration sont disponibles
  if (!config.EMAIL.HOST || !config.EMAIL.USER || !config.EMAIL.PASS) {
    console.warn('⚠️ Configuration email incomplète, les emails ne seront pas envoyés');
    return null;
  }
  
  return nodemailer.createTransport({
    host: config.EMAIL.HOST,
    port: config.EMAIL.PORT,
    secure: config.EMAIL.SECURE,
    auth: {
      user: config.EMAIL.USER,
      pass: config.EMAIL.PASS
    }
  });
};

// Transporteur email
let transporter = createTransporter();

/**
 * Envoie un email de confirmation de commande
 * @param {Object} orderData - Données de la commande
 * @returns {Promise<boolean>} - Succès de l'envoi
 */
const sendOrderConfirmation = async (orderData) => {
  if (!transporter) {
    console.warn('Email non envoyé: transporteur non configuré');
    return false;
  }
  
  try {
    const { customerInfo, orderId, amount, items } = orderData;
    
    // Générer le HTML des articles commandés
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)} €</td>
      </tr>
    `).join('');
    
    // Envoyer l'email
    await transporter.sendMail({
      from: `"ProduitPremium" <${config.EMAIL.FROM}>`,
      to: customerInfo.email,
      subject: "Confirmation de votre commande",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Merci pour votre commande, ${customerInfo.name}!</h2>
          <p>Votre commande a été confirmée et sera expédiée sous 24h.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Numéro de commande:</strong> ${orderId}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Montant total:</strong> ${(amount / 100).toFixed(2)} €</p>
            <p><strong>Adresse de livraison:</strong><br>
            ${customerInfo.address}<br>
            ${customerInfo.city}, ${customerInfo.postalCode}<br>
            ${customerInfo.country}</p>
          </div>
          
          <h3>Détail de votre commande</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 10px; text-align: left;">Produit</th>
                <th style="padding: 10px; text-align: center;">Quantité</th>
                <th style="padding: 10px; text-align: right;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                <td style="padding: 10px; text-align: right;"><strong>${(amount / 100).toFixed(2)} €</strong></td>
              </tr>
            </tfoot>
          </table>
          
          <p style="margin-top: 30px;">Si vous avez des questions concernant votre commande, n'hésitez pas à nous contacter à <a href="mailto:support@produitpremium.com">support@produitpremium.com</a>.</p>
          <p>Cordialement,<br>L'équipe ProduitPremium</p>
        </div>
      `
    });
    
    return true;
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return false;
  }
};

export { sendOrderConfirmation };