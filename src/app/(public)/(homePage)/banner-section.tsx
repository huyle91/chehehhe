
import Image from "next/image";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

const foodItems = [
    {
      name: "Salads",
      image: "https://www.godubrovnik.com/wp-content/uploads/pizza.jpg",
      color: "bg-green-100",
    },
    {
      name: "Foods",
      image: "https://www.godubrovnik.com/wp-content/uploads/pizza.jpg",
      color: "bg-yellow-100",
    },
    {
      name: "Drinks",
      image: "https://www.godubrovnik.com/wp-content/uploads/pizza.jpg",
      color: "bg-orange-100",
    },
  ];

export default function Banner() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);



    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-xl w-full backdrop-blur-md bg-white/10 p-6 rounded-2xl"
              >
                <div className="animate-fade-in">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    When you are <span className="text-orange-300 drop-shadow-[0_0_8px_rgba(255,165,0,0.3)]">Home Alone</span> and Hungry?
                  </h1>
                  <p className="text-gray-100 mb-6 sm:mb-8 text-sm sm:text-base drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                    The QuickSnacks is the best website for explore new Snacks and Recipes of food and Smoothies it's very simple to use and the best way to find new with the help of us!
                  </p>
                </div>

                {/* Search Bar */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="relative max-w-md w-full"
                >
                  <input
                    type="text"
                    placeholder="Chicken Breast"
                    className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </motion.div>
              </motion.div>

              {/* Right Food Images */}
              <div className="relative w-full md:w-[600px] h-[230px] sm:h-[330px] md:h-[400px] flex items-center justify-between sm:gap-4 md:gap-6">
                {foodItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5,
                      delay: index * 0.2,
                      ease: "easeOut"
                    }}
                    className="relative"
                  >
                    <div
                      className={`w-24 sm:w-48 h-40 sm:h-64 ${item.color} rounded-3xl overflow-hidden shadow-lg transition-all duration-200 hover:scale-105 ${
                        hoveredIndex === index ? "z-10" : "z-0"
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          loading="eager"
                          priority={index === 0}
                        />
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 + (index * 0.2) }}
                          className="absolute bottom-4 left-0 right-0 px-4 text-center"
                        >
                          <span className="inline-block bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm font-medium">
                            {item.name}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
    )

}