import React, { useState } from 'react';
import { Tractor, Wrench, Search, Menu, X, ChevronRight, Star, Users, Clock, DollarSign, Leaf, ShieldCheck, Hammer  } from 'lucide-react';

const ToolCard = ({ name, description, image, rating }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <img src={image} alt={name} className="w-full h-48 object-cover rounded-md mb-4" />
    <h3 className="text-xl font-semibold mb-2">{name}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <div className="flex items-center mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={20} className={i < rating ? "text-yellow-400" : "text-gray-300"} fill={i < rating ? "currentColor" : "none"} />
      ))}
      <span className="ml-2 text-gray-600">({rating.toFixed(1)})</span>
    </div>
    <button className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center">
      Rent Now
      <ChevronRight size={20} className="ml-2" />
    </button>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
      <Icon size={32} className="text-green-600" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const BenefitCard = ({ icon: Icon, title, description }) => (
    <div className="flex items-start p-6 bg-white rounded-lg shadow-md">
      <div className="flex-shrink-0 mr-4">
        <div className="p-3 bg-green-100 rounded-full">
          <Icon size={24} className="text-green-600" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Empower Your Farm with the Right Tools</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Find and rent the equipment you need to boost your agricultural productivity</p>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search for tools..."
                className="w-full px-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button className="absolute right-2 top-2 bg-green-600 p-2 rounded-full hover:bg-green-700 transition-colors">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Featured Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ToolCard
              name="Modern Tractor"
              description="High-performance tractor for efficient farming operations"
              image="/api/placeholder/400/300"
              rating={4.5}
            />
            <ToolCard
              name="Advanced Plow"
              description="Heavy-duty plow for precise field preparation"
              image="/api/placeholder/400/300"
              rating={4.2}
            />
            <ToolCard
              name="Precision Seeder"
              description="State-of-the-art seeder for various crops and soil types"
              image="/api/placeholder/400/300"
              rating={4.7}
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Why Choose FarmTools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitCard
              icon={DollarSign}
              title="Cost-Effective"
              description="Save money by renting tools only when you need them, avoiding expensive purchases and maintenance costs."
            />
            <BenefitCard
              icon={Hammer }
              title="Wide Selection"
              description="Access a diverse range of high-quality, well-maintained farming tools and equipment."
            />
            <BenefitCard
              icon={Leaf}
              title="Eco-Friendly"
              description="Reduce environmental impact by sharing resources and minimizing unused equipment."
            />
            <BenefitCard
              icon={ShieldCheck}
              title="Quality Assurance"
              description="All our tools are regularly inspected and maintained to ensure top performance and safety."
            />
            <BenefitCard
              icon={Clock}
              title="Flexible Rentals"
              description="Choose rental periods that fit your schedule, from daily to seasonal options."
            />
            <BenefitCard
              icon={Users}
              title="Community Support"
              description="Join a network of farmers sharing knowledge and experiences to help you succeed."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Search}
              title="Find Tools"
              description="Browse our extensive catalog of farm equipment and tools"
            />
            <FeatureCard
              icon={Clock}
              title="Book & Pay"
              description="Select your rental period and complete the secure payment process"
            />
            <FeatureCard
              icon={Tractor}
              title="Use & Return"
              description="Pick up your tools, use them for your project, and return them on time"
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">What Our Customers Say</h2>
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <p className="text-xl text-gray-600 mb-6">"FarmTools has revolutionized the way I manage my farm. Access to high-quality equipment without the hefty investment has boosted my productivity significantly."</p>
            <div className="flex items-center justify-center">
              <img src="/api/placeholder/64/64" alt="John Doe" className="w-16 h-16 rounded-full mr-4" />
              <div className="text-left">
                <p className="font-semibold text-gray-800">John Doe</p>
                <p className="text-gray-600">Local Farmer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of farmers who trust FarmTools for their equipment needs</p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-100 transition-colors">
            Sign Up Now
          </button>
        </div>
      </section>

      {/* Footer */}
      
    </div>
  );
};

export default LandingPage;