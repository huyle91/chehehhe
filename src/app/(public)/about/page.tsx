'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react';
import { useEffect } from 'react';

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: "Fresh Ingredients",
      description: "We use only the freshest, highest-quality ingredients in all our dishes.",
      icon: "🥬",
    },
    {
      title: "Expert Chefs", 
      description: "Our experienced chefs bring years of culinary expertise to every meal.",
      icon: "👨‍🍳",
    },
    {
      title: "Fast Delivery",
      description: "Quick and reliable delivery service to your doorstep.",
      icon: "🚚",
    },
  ]

  const stats = [
    { number: "15+", label: "Years Experience" },
    { number: "50+", label: "Expert Chefs" },
    { number: "1000+", label: "Happy Customers" },
    { number: "300+", label: "Menu Items" },
  ]

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark overlay with slight transparency */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative h-[600px] overflow-hidden">
         
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center text-center"
          >
            <div className="text-white max-w-4xl px-4">
              <h1 className="text-7xl font-extrabold mb-8 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">About Us</h1>
              <p className="text-2xl font-medium leading-relaxed drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                Crafting memorable dining experiences with passion and dedication since 2008
              </p>
            </div>
          </motion.div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Our Mission</h2>
                <p className="text-gray-200 mb-8 leading-relaxed drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                  At QuickSNACKS, we believe in delivering not just food, but experiences. 
                  Our mission is to bring restaurant-quality meals to your doorstep while 
                  maintaining the highest standards of quality and service.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="backdrop-blur-md bg-white/10 p-6 rounded-xl text-center border border-white/10"
                    >
                      <div className="text-3xl font-bold text-orange-300 mb-2 drop-shadow-[0_0_8px_rgba(255,165,0,0.3)]">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-200 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative h-[500px] rounded-2xl overflow-hidden shadow-lg border border-white/10"
              >
                <Image
                  src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf"
                  alt="Restaurant Kitchen"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 backdrop-blur-md bg-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Why Choose Us?</h2>
              <p className="text-gray-200 max-w-2xl mx-auto drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                We take pride in offering the best dining experience with our commitment 
                to quality and service excellence.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  className="backdrop-blur-md bg-white/20 p-8 rounded-xl shadow-lg border border-white/10"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">{feature.title}</h3>
                  <p className="text-gray-200 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Meet Our Team</h2>
              <p className="text-gray-200 max-w-2xl mx-auto drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                The talented people behind our success
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="relative group"
                >
                  <div className="relative h-[300px] rounded-xl overflow-hidden shadow-lg border border-white/10">
                    <Image
                      src={`https://www.godubrovnik.com/wp-content/uploads/pizza.jpg`}
                      alt={`Team Member ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent backdrop-blur-sm p-6">
                    <h3 className="font-semibold text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">Chef Name</h3>
                    <p className="text-sm text-gray-200 opacity-90 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">Position</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}