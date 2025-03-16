"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Star, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useGetRestaurantById } from "@/queries/useRestaurant";
import { useEffect, useState } from "react";

// API response type
interface ApiRestaurant {
  _id: string
  name: string
  address: string
  phone: string
  createdAt: string
  updatedAt: string
}

interface Location {
  lat: number
  lng: number
}

// Extended type with default values
interface Restaurant extends ApiRestaurant {
  image: string
  rating: number
  hours: string
  specialties: string[]
  description: string
  facilities: string[]
  images: string[]
  location?: Location
}

// Default values for missing fields
const DEFAULT_VALUES: Omit<Restaurant, keyof ApiRestaurant> = {
  image: "https://www.godubrovnik.com/wp-content/uploads/pizza.jpg",
  rating: 4.8,
  hours: "9:00 AM - 10:00 PM",
  specialties: ["Hot Pot", "BBQ", "Seafood"],
  description: "Our downtown location features a modern dining atmosphere with traditional Asian cuisine.",
  facilities: ["Parking", "Wheelchair Access", "Private Rooms", "Outdoor Seating"],
  images: Array(4).fill("https://www.godubrovnik.com/wp-content/uploads/pizza.jpg")
}

// Default location (Ho Chi Minh City center)
const DEFAULT_LOCATION: Location = {
  lat: 10.762622,
  lng: 106.660172
}

export default function BranchDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);

  const { data: restaurantData, isLoading } = useGetRestaurantById(id);
  
  useEffect(() => {
    const geocodeAddress = async (address: string) => {
      try {
        // Thêm "Vietnam" vào cuối địa chỉ nếu chưa có
        const searchAddress = address.toLowerCase().includes('việt nam') || 
                            address.toLowerCase().includes('vietnam') 
                            ? address 
                            : `${address}, Vietnam`;

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` + 
          `format=json&` +
          `q=${encodeURIComponent(searchAddress)}&` +
          `countrycodes=vn&` + // Giới hạn tìm kiếm trong Việt Nam
          `addressdetails=1&` + // Lấy thêm chi tiết địa chỉ
          `limit=1` // Chỉ lấy kết quả chính xác nhất
        );
        
        const data = await response.json();
        
        if (data && data[0]) {
          setLocation({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          });
        } else {
          // Nếu không tìm thấy, thử tìm kiếm lại với địa chỉ đơn giản hóa
          const simplifiedAddress = searchAddress
            .split(',')[0] // Lấy phần đầu tiên của địa chỉ
            .trim();
          
          const retryResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?` +
            `format=json&` +
            `q=${encodeURIComponent(simplifiedAddress)}, Vietnam&` +
            `countrycodes=vn&` +
            `limit=1`
          );
          
          const retryData = await retryResponse.json();
          
          if (retryData && retryData[0]) {
            setLocation({
              lat: parseFloat(retryData[0].lat),
              lng: parseFloat(retryData[0].lon)
            });
          }
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    };

    if (restaurantData?.payload?.data?.address) {
      geocodeAddress(restaurantData.payload.data.address);
    }
  }, [restaurantData?.payload?.data?.address]);

  if (isLoading || !restaurantData?.payload?.data) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Combine API data with default values
  const restaurant: Restaurant = {
    ...restaurantData.payload.data,
    ...DEFAULT_VALUES,
    location
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
      <div className="relative z-10 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => router.push('/branches')}
            className="flex items-center gap-2 text-gray-200 mb-8 hover:text-orange-400"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Branches
          </motion.button>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative h-[400px] rounded-xl overflow-hidden mb-4 shadow-lg border border-white/10">
                <Image
                  src={restaurant.image}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {restaurant.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative h-20 rounded-lg overflow-hidden shadow-lg border border-white/10"
                  >
                    <Image
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{restaurant.name}</h1>
                <div className="backdrop-blur-md bg-white/20 px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
                  <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  <span className="font-medium text-white">{restaurant.rating}</span>
                </div>
              </div>

              <p className="text-gray-200 leading-relaxed drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                {restaurant.description}
              </p>

              <div className="space-y-4 backdrop-blur-md bg-white/10 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 text-gray-200">
                  <MapPin className="w-5 h-5" />
                  <span className="drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">{restaurant.address}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-200">
                  <Phone className="w-5 h-5" />
                  <span className="drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">{restaurant.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-200">
                  <Clock className="w-5 h-5" />
                  <span className="drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">{restaurant.hours}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {restaurant.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="bg-orange-400/20 text-orange-200 px-3 py-1 rounded-full text-sm border border-orange-200/20 backdrop-blur-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">Facilities</h3>
                <div className="grid grid-cols-2 gap-4">
                  {restaurant.facilities.map((facility, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-gray-200"
                    >
                      <div className="w-2 h-2 bg-orange-400 rounded-full" />
                      <span className="drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Map Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Location</h2>
            <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg border border-white/10">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng-0.01}%2C${location.lat-0.01}%2C${location.lng+0.01}%2C${location.lat+0.01}&layer=mapnik&marker=${location.lat}%2C${location.lng}`}
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen={true}
                aria-hidden="false"
                tabIndex={0}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}