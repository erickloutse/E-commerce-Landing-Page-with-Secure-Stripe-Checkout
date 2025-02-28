import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// Import required modules
import { Pagination, Autoplay } from 'swiper/modules';

const testimonials = [
  {
    id: 1,
    name: 'Marie Dupont',
    role: 'Designer',
    content: 'Ce produit a complètement transformé ma façon de travailler. La qualité est exceptionnelle et le design est tout simplement parfait. Je le recommande vivement !',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 2,
    name: 'Thomas Martin',
    role: 'Entrepreneur',
    content: 'Après avoir essayé plusieurs produits similaires, celui-ci est de loin le meilleur. Le rapport qualité-prix est imbattable et le service client est impeccable.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 3,
    name: 'Sophie Lefebvre',
    role: 'Photographe',
    content: 'Un achat dont je ne peux plus me passer. La finition est impeccable et les fonctionnalités dépassent mes attentes. Livraison rapide en prime !',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 4,
    name: 'Jean Moreau',
    role: 'Ingénieur',
    content: 'Produit innovant qui répond parfaitement à mes besoins quotidiens. La technologie utilisée est vraiment impressionnante. Je suis très satisfait de mon achat.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 5,
    name: 'Camille Dubois',
    role: 'Médecin',
    content: 'J\'utilise ce produit tous les jours et je suis impressionnée par sa durabilité. Après 6 mois d\'utilisation intensive, il fonctionne toujours comme au premier jour.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 6,
    name: 'Lucas Bernard',
    role: 'Sportif professionnel',
    content: 'Ce produit m\'accompagne dans toutes mes compétitions. Sa légèreté et sa robustesse en font un allié de choix pour mes performances.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  }
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-800">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ce que nos clients disent</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Découvrez les témoignages de nos clients satisfaits qui ont transformé leur quotidien grâce à ProduitPremium.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            modules={[Pagination, Autoplay]}
            className="testimonial-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < testimonial.rating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 flex-grow">{testimonial.content}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">4.8/5</div>
            <div className="flex justify-center mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Basé sur 1200+ avis</p>
          </div>

          <div className="h-16 w-px bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

          <div className="flex flex-wrap justify-center gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/8d/Trustpilot_logo.svg" alt="Trustpilot" className="h-10 object-contain grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="h-10 object-contain grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon" className="h-10 object-contain grayscale hover:grayscale-0 transition-all" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;