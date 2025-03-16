
"use client";


import { motion } from "framer-motion";
import Image from "next/image";

export default function WhyFreshy() {
  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="py-8 sm:py-16 backdrop-blur-md bg-white/10 my-8 sm:my-[100px] rounded-3xl"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-14 flex flex-col lg:flex-row gap-8 sm:gap-12">
          {/* Left Content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <span className="text-orange-300 font-medium mb-2 block drop-shadow-[0_0_4px_rgba(255,165,0,0.3)]">
              About
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              Why Freshy?
            </h2>

            <div className="space-y-6 sm:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                  Chef-Crafted For Pure Joy
                </h3>
                <p className="text-gray-200 text-sm sm:text-base drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                  Lorem ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                  Ingredient You Can Trust
                </h3>
                <p className="text-gray-200 text-sm sm:text-base drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                  Lorem ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                  Special Dishes As You Like
                </h3>
                <p className="text-gray-200 text-sm sm:text-base drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                  Lorem ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard
                </p>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-500 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-red-600 transition-all duration-300 text-sm sm:text-base"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>

          {/* Right Images Grid */}
          <motion.div
            className="flex-1 relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <div className="relative h-[400px] sm:h-[600px] w-full">
              <Image
                src="https://www.godubrovnik.com/wp-content/uploads/pizza.jpg"
                alt="French Fries"
                width={200}
                height={200}
                className="absolute top-[-2%] left-0 transform -rotate-12 rounded-[30px] object-cover shadow-lg transition-all duration-300 hover:rotate-0 sm:w-[300px] sm:h-[300px] md:w-[300px] md:h-[200px]"
              />

              <Image
                src="https://www.godubrovnik.com/wp-content/uploads/pizza.jpg"
                alt="Sandwich"
                width={200}
                height={200}
                className="absolute top-1/3 right-[-3%] transform rotate-12 rounded-[30px] object-cover shadow-lg transition-all duration-300 hover:rotate-0 sm:w-[300px] sm:h-[300px] md:w-[300px] md:h-[200px]"
              />

              <Image
                src="https://www.godubrovnik.com/wp-content/uploads/pizza.jpg"
                alt="Steak"
                width={200}
                height={200}
                className="absolute bottom-[-2%] left-1/4 transform rotate-6 rounded-[30px] object-cover shadow-lg transition-all duration-300 hover:rotate-0 sm:w-[300px] sm:h-[300px] md:w-[300px] md:h-[200px]"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
