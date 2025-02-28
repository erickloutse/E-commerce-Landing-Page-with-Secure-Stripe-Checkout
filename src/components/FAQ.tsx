import React from 'react';
import { motion } from 'framer-motion';
import { Disclosure } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Quelles sont les caractéristiques techniques du ProduitPremium ?",
    answer: "Le ProduitPremium est fabriqué avec des matériaux de haute qualité, résistants à l'eau et aux chocs. Il dispose d'une batterie longue durée de 48h, d'une connectivité Bluetooth 5.0 et d'une garantie de 2 ans. Ses dimensions sont de 10 x 5 x 2 cm et il pèse seulement 150g."
  },
  {
    question: "Comment fonctionne la livraison et quels sont les délais ?",
    answer: "Nous proposons une livraison express en 24-48h partout en France métropolitaine. La livraison est gratuite pour toute commande supérieure à 50€. Vous recevrez un email de confirmation avec un numéro de suivi dès que votre colis sera expédié."
  },
  {
    question: "Quelle est votre politique de retour ?",
    answer: "Nous offrons une garantie satisfait ou remboursé de 30 jours. Si vous n'êtes pas entièrement satisfait de votre achat, vous pouvez nous retourner le produit dans son emballage d'origine et nous vous rembourserons intégralement, frais de livraison inclus."
  },
  {
    question: "Le ProduitPremium est-il compatible avec tous les appareils ?",
    answer: "Oui, le ProduitPremium est compatible avec tous les appareils iOS et Android grâce à sa connectivité Bluetooth 5.0. Il fonctionne également avec Windows et macOS. Notre application dédiée est disponible gratuitement sur l'App Store et Google Play."
  },
  {
    question: "Comment contacter le service client ?",
    answer: "Notre service client est disponible du lundi au vendredi de 9h à 18h par téléphone au 01 23 45 67 89, par email à support@produitpremium.com ou via le chat en direct sur notre site. Nous nous engageons à répondre à toutes vos demandes sous 24h."
  },
  {
    question: "Proposez-vous des réductions pour les achats en volume ?",
    answer: "Oui, nous proposons des tarifs dégressifs pour les achats en volume. Pour 2 produits achetés, bénéficiez de 10% de réduction. Pour 3 produits ou plus, la remise s'élève à 15%. Les entreprises peuvent nous contacter directement pour des commandes spéciales."
  }
];

const FAQ: React.FC = () => {
  return (
    <section id="faq" className="py-20 bg-white dark:bg-gray-800">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Questions Fréquentes</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur ProduitPremium et nos services.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Disclosure as="div" className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex justify-between w-full px-6 py-4 text-left text-gray-900 dark:text-white font-medium focus:outline-none focus-visible:ring focus-visible:ring-primary-500">
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`${
                            open ? 'transform rotate-180' : ''
                          } w-5 h-5 text-primary-600 dark:text-primary-400 transition-transform duration-200`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-6 py-4 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-600">
                        {faq.answer}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Vous avez d'autres questions ? N'hésitez pas à nous contacter.
          </p>
          <a 
            href="mailto:contact@produitpremium.com" 
            className="btn btn-secondary inline-flex items-center"
          >
            Contactez-nous
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;