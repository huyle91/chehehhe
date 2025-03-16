"use client";

import "swiper/css/navigation";
import { motion, AnimatePresence } from "framer-motion";

import Category from "./category-section";
import Dish from "./dish-section";
import SubmitRecipe from "./submit-recipe-section";
import WhyFreshy from "./why-fesh-section";
import Banner from "./banner-section";

interface Category {
  _id: string;
  name: string;
  description: string;
  image?: string;
  ingredients?: string[];
  createdAt: string;
  updatedAt: string;
}

interface Dish {
  _id: string;
  name: string;
  description: string;
  image?: string;
  category?: {
    _id: string;
    name: string;
  };
  price: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryProps {
  categoryList: Category[];
}

interface DishProps {
  dishList: Dish[];
}

export default function HomeContainer({
  categories,
  dishes,
}: {
  categories: CategoryProps["categoryList"];
  dishes: DishProps["dishList"];
}) {
  return (
    <AnimatePresence>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-screen max-w-full overflow-x-hidden"
      >
        {/* Background Image with Overlay */}
        <div
          className="fixed inset-0 w-full h-full z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Dark overlay with slight transparency */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        </div>

        {/* Content wrapper with relative positioning and increased text visibility */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="pt-20">
            <Banner/>
            {/* Categories Slider */}
            <Category categoryList={categories} />
            {/* Dishes Section */}
            <Dish dishList={dishes} />
            {/* Submit Recipe Section */}
            <SubmitRecipe />
            {/* About Section - Why Freshy? */}
            <WhyFreshy />
          </div>
        </div>
      </motion.main>
    </AnimatePresence>
  );
}
