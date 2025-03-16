
"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { motion } from "framer-motion";
import { Navigation, Autoplay } from "swiper/modules";

interface CategoryProps {
  categoryList: {
    _id: string;
    name: string;
    description: string;
    image?: string;
    ingredients?: string[];
    createdAt: string;
    updatedAt: string;
  }[];
}

export default function Category({ categoryList }: CategoryProps) {
    
  return (
    <>
      {/* Categories Slider */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="backdrop-blur-md bg-white/10 rounded-3xl p-6 sm:p-14 mb-8 sm:mb-16"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
          Categories
        </h2>

        <Swiper
          spaceBetween={16}
          slidesPerView={3}
          breakpoints={{
            640: {
              slidesPerView: 4,
            },
            768: {
              slidesPerView: 5,
            },
            1024: {
              slidesPerView: 7,
            },
          }}
          className="w-full"
          modules={[Navigation, Autoplay]}
         
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
          speed={2500}
        >
          {categoryList.map((item) => (
            <SwiperSlide key={item._id}>
              <motion.div className="text-center cursor-pointer transition-all duration-300">
                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-2 relative overflow-hidden rounded-full">
                  <Image
                    src={
                      item.image ||
                      "https://www.godubrovnik.com/wp-content/uploads/pizza.jpg"
                    }
                    alt={item.name}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className="text-xs sm:text-sm font-medium text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                  {item.name}
                </p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.section>
    </>
  );
}
