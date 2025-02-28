import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, CreditCard, Award } from 'lucide-react';

const benefits = [
  {
    id: 1,
    icon: <Truck className="w-10 h-10 text-primary-600 dark:text-primary-400" />,
    title: 'Livraison Express',
    description: 'Recevez votre commande en 24-48h partout en France métropolitaine. Livraison offerte dès 50€ d\'achat.'
  },
  {
    id: 2,
    icon: <ShieldCheck className="w-10 h-10 text-primary-600 dark:text-primary-400" />,
    title: 'Garantie Satisfait ou Remboursé',
    description: 'Essayez notre produit pendant 30 jours. Si vous n\'êtes pas satisfait, nous vous remboursons intégralement.'
  },
  {
    id: 3,
    icon: <CreditCard className="w-10 h-10 text-primary-600 dark:text-primary-400" />,
    title: 'Paiement 100% Sécurisé',
    description: 'Vos données bancaires sont protégées par un cryptage SSL. Paiement en 3x sans frais disponible.'
  },
  {
    id: 4,
    icon: <Award className="w-10 h-10 text-primary-600 dark:text-primary-400" />,
    title: 'Matériaux Haut de Gamme',
    description: 'Nos produits sont fabriqués avec des matériaux de première qualité, certifiés et respectueux de l\'environnement.'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Benefits: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pourquoi Choisir ProduitPremium</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Nous nous engageons à vous offrir une expérience exceptionnelle, de l'achat à l'utilisation quotidienne.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {benefits.map((benefit) => (
            <motion.div 
              key={benefit.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center"
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;