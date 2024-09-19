import React, { useState, useEffect } from 'react';
import { Tractor, Wrench, Search, Menu, X, ChevronRight, Star, Users, Clock, DollarSign, Leaf, ShieldCheck, Hammer } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTool } from '../context/ToolContext';
const ToolCard = ({ name, description, image, rating=2 }) => {
  const imageUrl = `${process.env.REACT_APP_BACKEND_URL}/${image}`
  const defaultImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGY6b7YqSv02iiBVLEoVUx10301RnmFA1x3BLU61s-qnicrJSzIEmPHgPIGQxclEXbC2k&usqp=CAU'

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img 
        src={imageUrl} 
        alt={name} 
        className="w-full h-48 object-cover rounded-md mb-4" 
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultImageUrl;
        }}
      />
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={20} className={i < rating ? "text-yellow-400" : "text-gray-300"} fill={i < rating ? "currentColor" : "none"} />
        ))}
        <span className="ml-2 text-gray-600">({3})</span>
      </div>
      <motion.button
        className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Rent Now
        <ChevronRight size={20} className="ml-2" />
      </motion.button>
    </motion.div>
  )
}

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-md text-center"
    whileHover={{ y: -10 }}
  >
    <motion.div
      className="inline-block p-3 bg-green-100 rounded-full mb-4"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.5 }}
    >
      <Icon size={32} className="text-green-600" />
    </motion.div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const BenefitCard = ({ icon: Icon, title, description }) => (
  <motion.div
    className="flex items-start p-6 bg-white rounded-lg shadow-md"
    whileHover={{ scale: 1.05 }}
  >
    <div className="flex-shrink-0 mr-4">
      <motion.div
        className="p-3 bg-green-100 rounded-full"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <Icon size={24} className="text-green-600" />
      </motion.div>
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
);

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { tools } = useTool();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-r from-green-500 to-green-600 text-white py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-5xl md:text-6xl font-bold mb-4 leading-tight"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
          >
            Revolutionize Your Farming
          </motion.h2>
          <motion.p
            className="text-2xl mb-8 max-w-2xl mx-auto"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
          >
            Access cutting-edge tools to skyrocket your agricultural productivity
          </motion.p>
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 120 }}
          >
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Discover tools..."
                className="w-full px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 text-lg"
              />
              <motion.button
                className="absolute right-2 top-2 bg-green-600 p-3 rounded-full hover:bg-green-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Search size={24} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Tools Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold mb-12 text-center text-gray-800"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Cutting-Edge Farm Tools
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {
              tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  name={tool.name}
                  description={tool.description}
                  image={tool.images[0]}
                  rating={tool.rating}
                />
              ))
            }
            {/* <ToolCard
              name="AI-Powered Tractor"
              description="Autonomous tractor with advanced AI for precision farming"
              image="/api/placeholder/400/300"
              rating={4.9}
            />
            <ToolCard
              name="Drone Crop Sprayer"
              description="High-capacity drone for efficient and targeted crop spraying"
              image="/api/placeholder/400/300"
              rating={4.7}
            />
            <ToolCard
              name="Smart Irrigation System"
              description="IoT-enabled irrigation system for optimal water management"
              image="/api/placeholder/400/300"
              rating={4.8}
            /> */}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <motion.section
        className="py-20 bg-green-50"
        style={{
          backgroundPositionY: scrollY * 0.5,
        }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold mb-12 text-center text-gray-800"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            The FarmTools Advantage
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <BenefitCard
              icon={DollarSign}
              title="Maximize ROI"
              description="Access top-tier equipment without capital investment, boosting your farm's profitability."
            />
            <BenefitCard
              icon={Hammer}
              title="Cutting-Edge Tech"
              description="Stay ahead with our constantly updated inventory of the latest agricultural innovations."
            />
            <BenefitCard
              icon={Leaf}
              title="Sustainable Farming"
              description="Reduce your carbon footprint with our eco-friendly and energy-efficient tools."
            />
            <BenefitCard
              icon={ShieldCheck}
              title="Guaranteed Performance"
              description="Every tool undergoes rigorous testing to ensure peak performance and safety."
            />
            <BenefitCard
              icon={Clock}
              title="On-Demand Access"
              description="Get the right tool exactly when you need it, from hourly to seasonal rentals."
            />
            <BenefitCard
              icon={Users}
              title="Expert Network"
              description="Tap into our community of agricultural experts for advice and best practices."
            />
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold mb-12 text-center text-gray-800"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Seamless Renting Process
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              icon={Search}
              title="Discover"
              description="Explore our vast selection of state-of-the-art farming equipment"
            />
            <FeatureCard
              icon={Clock}
              title="Reserve"
              description="Book your tools with our flexible, user-friendly scheduling system"
            />
            <FeatureCard
              icon={Tractor}
              title="Transform"
              description="Elevate your farm's efficiency with our cutting-edge tools"
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <motion.section
        className="py-20 bg-green-50"
        style={{
          backgroundPositionY: scrollY * 0.5,
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl font-bold mb-12 text-gray-800"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Success Stories
          </motion.h2>
          <motion.div
            className="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow-xl"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-2xl text-gray-600 mb-8">"FarmTools has transformed my 50-acre farm. Their AI-powered equipment increased my yield by 40% while reducing water usage. It's not just a service; it's a farming revolution."</p>
            <div className="flex items-center justify-center">
              <img src="/api/placeholder/80/80" alt="Emily Chen" className="w-20 h-20 rounded-full mr-6" />
              <div className="text-left">
                <p className="font-semibold text-xl text-gray-800">Emily Chen</p>
                <p className="text-gray-600">Award-winning Organic Farmer</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="bg-green-600 text-white py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl font-bold mb-6"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
          >
            Ready to Revolutionize Your Farm?
          </motion.h2>
          <motion.p
            className="text-2xl mb-10"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
          >
            Join the future of farming with FarmTools
          </motion.p>
          <motion.button
            className="bg-white text-green-600 px-10 py-4 rounded-full text-xl font-semibold hover:bg-green-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Start Your Free Trial
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;