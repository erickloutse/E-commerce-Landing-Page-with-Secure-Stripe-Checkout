import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductShowcase from './components/ProductShowcase';
import Testimonials from './components/Testimonials';
import Benefits from './components/Benefits';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { CartProvider } from './store/cartStore';
import CartDrawer from './components/CartDrawer';

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <Hero />
          <ProductShowcase />
          <Testimonials />
          <Benefits />
          <FAQ />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

export default App;