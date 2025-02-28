import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useCartStore } from "../store/cartStore";

const Hero: React.FC = () => {
  const { addItem } = useCartStore();

  const handleBuyNow = () => {
    addItem({
      id: "smart-speaker",
      name: "Amazon Echo Dot",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quantity: 1,
    });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="smart-speaker"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/30 dark:from-black/80 dark:to-black/60" />
      </div>

      <div className="container relative z-10 px-4 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transformez Votre Quotidien avec{" "}
            <span className="text-primary-400">ProduitPremium</span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Un design élégant, des matériaux premium et une technologie
            innovante pour révolutionner votre expérience au quotidien.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              className="btn btn-primary text-lg px-8 py-4 rounded-full shadow-lg"
              onClick={handleBuyNow}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Acheter Maintenant
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <a href="#product" className="flex flex-col items-center text-white">
          <span className="text-sm mb-2">Découvrir</span>
          <ArrowDown className="w-6 h-6" />
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
