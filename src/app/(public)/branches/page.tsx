'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Star } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGetListRestaurant } from '@/queries/useRestaurant'

// API response type
interface ApiRestaurant {
  _id: string
  name: string
  address: string
  phone: string
  createdAt: string
  updatedAt: string
}

// Extended type with default values
interface Restaurant extends ApiRestaurant {
  image: string
  rating: number
  hours: string
  specialties: string[]
}

// Default values for missing fields
const DEFAULT_VALUES: Omit<Restaurant, keyof ApiRestaurant> = {
  image: "https://www.godubrovnik.com/wp-content/uploads/pizza.jpg",
  rating: 4.5,
  hours: "9:00 AM - 10:00 PM",
  specialties: ["Hot Pot", "BBQ", "Seafood"]
}

export default function BranchesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()
  const pageSize = 6

  const { data: restaurantData, isLoading } = useGetListRestaurant(currentPage, pageSize, {
    sort: "",
    filter: ""
  })

  // Map API data with default values
  const restaurants = (restaurantData?.payload?.data?.result || []).map((restaurant: ApiRestaurant) => ({
    ...restaurant,
    ...DEFAULT_VALUES
  })) as Restaurant[]
  const totalPages = restaurantData?.payload?.data?.meta?.pages || 1

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
        <section className="relative h-[400px] overflow-hidden">
          <Image
            src="https://www.godubrovnik.com/wp-content/uploads/pizza.jpg"
            alt="Restaurant Locations"
            fill
            className="object-cover brightness-50"
          />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center text-center"
          >
            <div className="text-white max-w-3xl px-4">
              <h1 className="text-5xl font-bold mb-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Our Locations</h1>
              <p className="text-xl drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                Find the nearest Hot Pot restaurant and experience our exceptional service
              </p>
            </div>
          </motion.div>
        </section>

        {/* System Introduction */}
        <section className="py-16 backdrop-blur-md bg-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Our Restaurant System</h2>
              <p className="text-gray-200 max-w-2xl mx-auto drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                Experience the future of dining with our innovative QR ordering system. 
                Scan, order, and enjoy your meal with minimal contact and maximum efficiency.
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {['Order via QR', 'Real-time Updates', 'Easy Payment'].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  className="backdrop-blur-md bg-white/20 p-8 rounded-xl text-center border border-white/10"
                >
                  <h3 className="text-xl font-semibold mb-2 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">{feature}</h3>
                  <p className="text-gray-200 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                    Modern solutions for a seamless dining experience
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Branches Grid */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-8 justify-center">
              {restaurants.map((restaurant: Restaurant) => (
                <div
                  key={restaurant._id}
                  className="group backdrop-blur-md bg-white/20 rounded-xl overflow-hidden shadow-lg border border-white/10 w-full md:w-[calc(33.33%-1.5rem)]"
                  onClick={() => router.push(`/branches/${restaurant._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="relative transform transition-all duration-300 ease-in-out group-hover:bg-white/30">
                    <div className="relative h-48">
                      <Image
                        src={restaurant.image}
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4 backdrop-blur-md bg-white/20 px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
                        <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                        <span className="text-sm font-medium text-white">{restaurant.rating}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-4 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">{restaurant.name}</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-200">
                          <MapPin className="w-5 h-5" />
                          <span className="text-sm drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">{restaurant.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-200">
                          <Phone className="w-5 h-5" />
                          <span className="text-sm drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">{restaurant.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-200">
                          <Clock className="w-5 h-5" />
                          <span className="text-sm drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">{restaurant.hours}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">Specialties:</p>
                        <div className="flex flex-wrap gap-2">
                          {restaurant.specialties.map((specialty: string, idx: number) => (
                            <span 
                              key={idx}
                              className="bg-orange-400/20 text-orange-200 px-3 py-1 rounded-full text-sm border border-orange-200/20 backdrop-blur-sm"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="w-full flex justify-center mt-8 gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg backdrop-blur-md ${
                        currentPage === i + 1
                          ? 'bg-orange-500/80 text-white border border-orange-400/50'
                          : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}