"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Shield, Clock, CreditCard, Utensils, Users, AlertCircle } from "lucide-react";

export default function PolicyPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const policies = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Reservation Policy",
      details: [
        "Reservations are recommended for groups of 6 or more",
        "15 minutes grace period for reserved tables",
        "Please call ahead for special arrangements",
        "Cancellations should be made at least 2 hours in advance"
      ]
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Payment Policy",
      details: [
        "We accept all major credit cards",
        "Split bills available for groups",
        "Service charge of 10% for groups of 8 or more",
        "No personal checks accepted"
      ]
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "Dining Policy",
      details: [
        "Smart casual dress code",
        "Outside food and beverages not permitted",
        "Special dietary requirements - please inform staff",
        "Children must be supervised at all times"
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Group Dining",
      details: [
        "Special menus available for large groups",
        "Private dining room available on request",
        "Advance booking required for groups of 10+",
        "Custom menus available with advance notice"
      ]
    }
  ];

  const additionalPolicies = [
    {
      title: "COVID-19 Safety Measures",
      content: "We maintain strict hygiene standards and follow all local health guidelines to ensure your safety. Regular sanitization and staff health checks are conducted."
    },
    {
      title: "Privacy Policy",
      content: "We respect your privacy and protect your personal information. Your contact details are used only for reservation purposes and will not be shared with third parties."
    },
    {
      title: "Feedback & Complaints",
      content: "Your feedback is important to us. Please speak with our manager on duty for immediate concerns, or contact us through our feedback form."
    }
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
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              Restaurant Policies
            </h1>
            <p className="text-gray-200 text-lg drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
              To ensure the best dining experience for all our guests, please familiarize yourself with our policies
            </p>
          </motion.div>
        </div>

        {/* Main Policies Grid */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {policies.map((policy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="backdrop-blur-md bg-white/10 p-6 rounded-xl border border-white/10 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="text-orange-300 drop-shadow-[0_0_8px_rgba(255,165,0,0.3)]">
                    {policy.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                      {policy.title}
                    </h3>
                    <ul className="space-y-2">
                      {policy.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-200 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                          <div className="w-1.5 h-1.5 bg-orange-300 rounded-full" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Policies Section */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {additionalPolicies.map((policy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="backdrop-blur-md bg-white/10 p-6 rounded-xl border border-white/10 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="text-orange-300 mt-1">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                      {policy.title}
                    </h3>
                    <p className="text-gray-200 leading-relaxed drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
                      {policy.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-2xl mx-auto mt-16 text-center"
        >
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl border border-white/10 shadow-lg">
            <div className="flex justify-center mb-4">
              <Shield className="w-8 h-8 text-orange-300 drop-shadow-[0_0_8px_rgba(255,165,0,0.3)]" />
            </div>
            <p className="text-gray-200 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
              We reserve the right to modify these policies at any time. For the most current information, please speak with our staff.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
