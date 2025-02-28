import React, { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, Sun, Moon } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { totalItems, openCart } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container py-4 mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingBag className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              ProduitPremium
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            >
              Accueil
            </a>
            <a
              href="#product"
              className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            >
              Produit
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            >
              Témoignages
            </a>
            <a
              href="#faq"
              className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            <button
              onClick={openCart}
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-primary-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
          >
            <nav className="flex flex-col py-4 space-y-4 container">
              <a
                href="#"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accueil
              </a>
              <a
                href="#product"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Produit
              </a>
              <a
                href="#testimonials"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Témoignages
              </a>
              <a
                href="#faq"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
