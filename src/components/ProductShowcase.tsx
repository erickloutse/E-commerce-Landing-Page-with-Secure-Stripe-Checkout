import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";
import { useCartStore } from "../store/cartStore";

// Produits disponibles
const products = [
  {
    id: "smart-speaker",
    name: "Amazon Echo Dot",
    description:
      "Un haut-parleur intelligent avec assistant vocal intégré pour contrôler votre maison connectée.",
    price: 49.99,
    oldPrice: 69.99,
    discount: "-29%",
    image:
      "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    features: [
      "Assistant vocal intégré",
      "Contrôle des appareils connectés",
      "Qualité audio immersive",
      "Compatibilité Bluetooth et Wi-Fi",
      "Réponses aux questions et commandes vocales",
    ],
  },
  {
    id: "premium-watch",
    name: "Montre ProduitPremium",
    description:
      "Notre montre phare combine élégance, durabilité et innovation pour vous offrir une expérience inégalée.",
    price: 99.99,
    oldPrice: 129.99,
    discount: "-23%",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    features: [
      "Design élégant et minimaliste",
      "Matériaux premium de haute qualité",
      "Technologie innovante brevetée",
      "Garantie de 2 ans incluse",
      "Livraison express offerte",
    ],
  },
  {
    id: "premium-headphones",
    name: "Casque Audio Premium",
    description:
      "Une expérience sonore immersive avec notre casque sans fil à réduction de bruit active.",
    price: 149.99,
    oldPrice: 199.99,
    discount: "-25%",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    features: [
      "Réduction de bruit active",
      "Autonomie de 30 heures",
      "Son haute définition",
      "Confort optimal pour une utilisation prolongée",
      "Compatible avec tous les appareils",
    ],
  },
  {
    id: "premium-camera",
    name: "Appareil Photo Compact",
    description:
      "Capturez des moments inoubliables avec notre appareil photo compact et puissant.",
    price: 299.99,
    oldPrice: 349.99,
    discount: "-14%",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    features: [
      "Capteur 24 mégapixels",
      "Zoom optique 10x",
      "Stabilisation d'image",
      "Enregistrement vidéo 4K",
      "Connectivité Wi-Fi et Bluetooth",
    ],
  },
  {
    id: "premium-speaker",
    name: "Enceinte Bluetooth",
    description:
      "Une enceinte portable puissante avec un son cristallin pour toutes vos aventures.",
    price: 79.99,
    oldPrice: 99.99,
    discount: "-20%",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    features: [
      "Son stéréo puissant",
      "Étanche IPX7",
      "Autonomie de 20 heures",
      "Design compact et robuste",
      "Microphone intégré pour appels",
    ],
  },
  // Produits supplémentaires (cachés par défaut)
  {
    id: "premium-smartwatch",
    name: "Montre Connectée Sport",
    description:
      "Suivez vos performances sportives et restez connecté avec notre montre intelligente.",
    price: 129.99,
    oldPrice: 159.99,
    discount: "-19%",
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    features: [
      "Suivi d'activité complet",
      "Mesure de la fréquence cardiaque",
      "GPS intégré",
      "Étanche 50m",
      "Autonomie de 7 jours",
    ],
  },
  {
    id: "premium-earbuds",
    name: "Écouteurs Sans Fil",
    description:
      "Des écouteurs intra-auriculaires avec un son exceptionnel et une autonomie record.",
    price: 89.99,
    oldPrice: 119.99,
    discount: "-25%",
    image:
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    features: [
      "Son haute fidélité",
      "Réduction de bruit passive",
      "Autonomie totale de 36 heures",
      "Résistants à l'eau et à la transpiration",
      "Commandes tactiles intuitives",
    ],
  },
  {
    id: "premium-tablet",
    name: "Tablette Ultra-fine",
    description:
      "Une tablette performante avec un écran haute résolution pour le travail et les loisirs.",
    price: 249.99,
    oldPrice: 299.99,
    discount: "-17%",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    features: [
      'Écran 10.5" haute résolution',
      "Processeur octa-core",
      "Stockage 128 Go extensible",
      "Batterie longue durée",
      "Stylet compatible inclus",
    ],
  },
  {
    id: "premium-backpack",
    name: "Sac à Dos Intelligent",
    description:
      "Un sac à dos ergonomique avec port USB intégré et compartiments organisés.",
    price: 69.99,
    oldPrice: 89.99,
    discount: "-22%",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    features: [
      "Port USB intégré",
      'Compartiment pour ordinateur 15"',
      "Matériaux imperméables",
      "Design anti-vol",
      "Bretelles ergonomiques",
    ],
  },
];

const ProductShowcase: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  const displayedProducts = showAllProducts ? products : products.slice(0, 4);

  return (
    <section id="product" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Nos Produits Premium
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Découvrez notre gamme de produits innovants conçus pour améliorer
            votre quotidien avec style et efficacité.
          </p>
        </motion.div>

        {/* Featured Product */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20"
        >
          {/* Product Image */}
          <motion.div
            className="relative overflow-hidden rounded-lg shadow-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <motion.img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-auto"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>

          {/* Product Details */}
          <div>
            <motion.h2
              className="text-3xl font-bold mb-4 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {selectedProduct.name}
            </motion.h2>

            <motion.p
              className="text-gray-600 dark:text-gray-300 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {selectedProduct.description}
            </motion.p>

            <motion.ul
              className="space-y-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {selectedProduct.features.map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <Check className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              className="flex items-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {selectedProduct.price.toFixed(2)} €
                </span>
                <span className="ml-2 text-lg line-through text-gray-500">
                  {selectedProduct.oldPrice.toFixed(2)} €
                </span>
              </div>
              <span className="ml-4 px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-full">
                {selectedProduct.discount}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.button
                className="btn btn-primary rounded-full flex items-center"
                onClick={() => handleAddToCart(selectedProduct)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Commander Maintenant
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Tous nos produits
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {product.discount}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-baseline">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {product.price.toFixed(2)} €
                      </span>
                      <span className="ml-2 text-sm line-through text-gray-500">
                        {product.oldPrice.toFixed(2)} €
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        document
                          .getElementById("product")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
                    >
                      Détails
                    </button>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-4 btn btn-primary py-2 rounded-md flex items-center justify-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Ajouter au panier
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Show More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <motion.button
            onClick={() => setShowAllProducts(!showAllProducts)}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>
              {showAllProducts ? "Voir moins" : "Voir plus de produits"}
            </span>
            {showAllProducts ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcase;
