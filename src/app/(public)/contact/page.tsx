"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Number",
      details: ["+1 (555) 123-4567", "+1 (555) 765-4321"],
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Address",
      details: ["support@hotpot.com", "info@hotpot.com"],
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      details: ["123 Restaurant Street", "New York, NY 10001"],
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      details: ["Monday - Friday: 9AM - 10PM", "Weekend: 10AM - 11PM"],
    },
  ];

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
      <div className="relative z-10 py-12 px-4 mt-[75px]">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Get in Touch</h1>
          <p className="text-gray-200 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
            Have questions about our services? We'd love to hear from you. Send us
            a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="backdrop-blur-md bg-white/20 p-6 rounded-xl shadow-lg border border-white/10"
                >
                  <div className="text-orange-300 mb-4 drop-shadow-[0_0_8px_rgba(255,165,0,0.3)]">{info.icon}</div>
                  <h3 className="font-semibold mb-2 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-200 text-sm drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                      {detail}
                    </p>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Map Section */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="backdrop-blur-md bg-white/20 p-4 rounded-xl shadow-lg border border-white/10"
            >
              <div className="h-[300px] rounded-lg relative overflow-hidden">
                <Image
                  src="https://www.godubrovnik.com/wp-content/uploads/pizza.jpg"
                  alt="Restaurant Image"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-md bg-white/20 p-8 rounded-xl shadow-lg border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                  <label className="text-sm font-medium text-gray-200 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-white placeholder-gray-300 backdrop-blur-sm"
                    placeholder="John"
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                  <label className="text-sm font-medium text-gray-200 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-white placeholder-gray-300 backdrop-blur-sm"
                    placeholder="Doe"
                  />
                </motion.div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                <label className="text-sm font-medium text-gray-200 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-white placeholder-gray-300 backdrop-blur-sm"
                  placeholder="john@example.com"
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                <label className="text-sm font-medium text-gray-200 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-white placeholder-gray-300 backdrop-blur-sm"
                  placeholder="Your message here..."
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-orange-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg border border-orange-400/50"
              >
                <Send className="w-4 h-4" />
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}