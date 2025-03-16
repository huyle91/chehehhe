"use client";
import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Clock, Heart, Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation as SwiperNavigation } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import {
  useGetDishDetail,
} from "@/queries/useMenuByRestaurant";


export default function Menudetail() {
  const router = useRouter();
  const params = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  const id = params.id as string;

  const { data: dishDetail, isLoading, error } = useGetDishDetail(id);

   


  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }
  if (!dishDetail) {
    return <div>No data</div>;
  }
  console.log("dishDetail", dishDetail);
  const recentlyViewed = [
    "https://www.shibanovel.com/wp-content/uploads/2020/03/%C3%89%C3%A3%C3%8D%C2%BC%C3%8D%C3%B8_501406207-1-scaled-2048x1366.jpg",
    "https://www.shibanovel.com/wp-content/uploads/2020/03/%C3%89%C3%A3%C3%8D%C2%BC%C3%8D%C3%B8_501406207-1-scaled-2048x1366.jpg",
    "https://www.shibanovel.com/wp-content/uploads/2020/03/%C3%89%C3%A3%C3%8D%C2%BC%C3%8D%C3%B8_501406207-1-scaled-2048x1366.jpg",
    "https://www.shibanovel.com/wp-content/uploads/2020/03/%C3%89%C3%A3%C3%8D%C2%BC%C3%8D%C3%B8_501406207-1-scaled-2048x1366.jpg",
    "https://www.shibanovel.com/wp-content/uploads/2020/03/%C3%89%C3%A3%C3%8D%C2%BC%C3%8D%C3%B8_501406207-1-scaled-2048x1366.jpg",
    "https://www.shibanovel.com/wp-content/uploads/2020/03/%C3%89%C3%A3%C3%8D%C2%BC%C3%8D%C3%B8_501406207-1-scaled-2048x1366.jpg",
    "https://www.shibanovel.com/wp-content/uploads/2020/03/%C3%89%C3%A3%C3%8D%C2%BC%C3%8D%C3%B8_501406207-1-scaled-2048x1366.jpg",
  ];


  return (
    <div className="min-h-screen bg-white lg:py-4 md:pb-0 pb-[100px]">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto  rounded-lg">
        <div className="min-h-screen bg-white lg:border lg:border-gray-200 lg:rounded-lg">
          {/* Header Actions */}
          <div className="flex justify-between items-center p-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full bg-gray-100"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button className="p-2 rounded-full bg-gray-100">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Main Image */}
          <div className="px-4">
            <div className="relative w-full h-[200px] md:h-[350px] rounded-2xl overflow-hidden">
              <Image
                src={dishDetail?.payload?.data?.image || ""}
                alt={dishDetail?.payload?.data?.name || ""}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pt-4">
            <div className="space-y-4">
              {/* Title and Price */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">
                    {dishDetail?.payload?.data?.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">15-20 mins</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-400">4.5</span>
                  </div>
                </div>
                <span className="text-xl font-semibold">${dishDetail?.payload?.data?.price || 10}</span>
              </div>


              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {dishDetail?.payload?.data?.description}
              </p>


              {/* Bottom Actions */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t md:relative md:p-0 md:border-0 z-50">
                <div className="flex gap-3 max-w-md mx-auto md:max-w-none">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-3 rounded-xl border"
                  >
                    <Heart
                      className={`w-6 h-6 md:w-5 md:h-5 ${isFavorite ? "fill-current text-red-500" : "text-gray-400"}`}
                    />
                  </button>
                  <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl md:flex-initial md:px-6">
                    Add to cart
                  </Button>
                </div>
              </div>


              <div>
                <h2 className="font-medium text-gray-800 mb-3">
                  Recommended Dishes
                </h2>
                <div className="relative">
                  <Swiper
                    slidesPerView={2}
                    spaceBetween={16}
                    navigation={true}
                    modules={[SwiperNavigation]}
                    breakpoints={{
                      640: {
                        slidesPerView: 3,
                      },
                      768: {
                        slidesPerView: 4,
                      },
                      1024: {
                        slidesPerView: 5,
                      },
                    }}
                    className="mySwiper"
                  >
                    {recentlyViewed.map((img, index) => (
                      <SwiperSlide key={index}>
                        <div className="w-full rounded-lg overflow-hidden shadow-md bg-white">
                          {/* Card container with 2:1 height ratio */}
                          <div className="flex flex-col h-[300px] md:h-[350px]">
                            {/* Top section - Image */}
                            <div className="relative h-1/2 w-full">
                              <Image
                                src={img}
                                alt="Recommended dish"
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* Bottom section - Content */}
                            <div className="h-1/2 p-3 flex flex-col">
                              <h3 className="font-medium text-gray-900 mb-1 truncate">
                                Recommended Dish {index + 1}
                              </h3>
                              <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                Delicious dish with fresh ingredients and
                                amazing taste. Perfect for any occasion.
                              </p>
                              <div className="mt-auto">
                                <div className="flex items-center gap-1 mb-2">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-sm text-gray-600">
                                    4.5
                                  </span>
                                  <span className="text-sm text-gray-400">
                                    (120)
                                  </span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">
                                  $9.99
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}