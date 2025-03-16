"use client";



import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import { Navigation, Autoplay } from "swiper/modules";

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

interface DishProps {
  dishList: Dish[];
}

export default function Dish({ dishList }: DishProps) {
  if (!dishList || dishList.length === 0) {
    return <p className="text-center text-white">No dishes available</p>;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-8 sm:mb-16"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
        Our Special Dishes
      </h2>
      {dishList.length >= 3 ? (
        <div className="relative">
          <Swiper
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            modules={[Navigation, Autoplay]}
            navigation
            loop
            className="w-full !px-4 sm:!px-12"
          >
            {dishList.map((dish, index) => (
              <SwiperSlide key={dish._id || index} className="py-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="backdrop-blur-md bg-white/10 rounded-xl overflow-hidden shadow-lg border border-white/10 hover:bg-white/20 transition-all duration-300 h-full"
                >
                  <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                    <Image
                      src={
                        dish.image ||
                        "https://www.godubrovnik.com/wp-content/uploads/pizza.jpg"
                      }
                      alt={dish.name}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-125"
                    />
                    {dish.category && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                          {dish.category.name}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        ${dish.price}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                      {dish.name}
                    </h3>
                    <p className="text-gray-200 text-sm sm:text-base line-clamp-2 mb-4 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                      {dish.description}
                    </p>
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors duration-300 font-medium">
                      Explore Now
                    </button>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishList.map((dish, index) => (
            <motion.div
              key={dish._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="backdrop-blur-md bg-white/10 rounded-xl overflow-hidden shadow-lg border border-white/10 hover:bg-white/20 transition-all duration-300"
            >
              {/* Content */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                <Image
                  src={
                    dish.image ||
                    "https://www.godubrovnik.com/wp-content/uploads/pizza.jpg"
                  }
                  alt={dish.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-125"
                />
                {dish.category && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      {dish.category.name}
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    ${dish.price}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                  {dish.name}
                </h3>
                <p className="text-gray-200 text-sm sm:text-base line-clamp-2 mb-4 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                  {dish.description}
                </p>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors duration-300 font-medium">
                  Explore Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
