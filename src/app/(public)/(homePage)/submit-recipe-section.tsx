
"use client";


import { motion } from "framer-motion";
import Image from "next/image";

export default function SubmitRecipe() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col md:flex-row items-center justify-between backdrop-blur-md bg-white/10 rounded-3xl"
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            Want to Submit a Recipe?
          </h2>
          <p className="text-gray-200 mb-6 text-sm sm:text-lg drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
            Share your culinary creations with our community. Submit your recipe
            and let others enjoy your delicious dishes!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full transition-colors text-sm sm:text-base"
          >
            Submit Now
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative w-full h-64 sm:h-96 mt-6 md:mt-0"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-3xl"
            style={{
              clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          >
            <Image
              src={`https://www.godubrovnik.com/wp-content/uploads/pizza.jpg`}
              alt={`Food 1`}
              fill
              className="object-cover rounded-3xl"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
