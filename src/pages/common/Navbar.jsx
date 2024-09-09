import React, { useState } from 'react'
import { Tractor, Wrench, Search, Menu, X, ChevronRight, Star, Users, Clock, DollarSign, Leaf, ShieldCheck, Hammer  } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
        <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Tractor size={32} className="text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">FarmTools</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Home</a>
            <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Tools</a>
            <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">How It Works</a>
            <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Contact</a>
          </nav>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-4 px-4">
            <a href="#" className="block py-2 text-gray-600 hover:text-green-600 transition-colors">Home</a>
            <a href="#" className="block py-2 text-gray-600 hover:text-green-600 transition-colors">Tools</a>
            <a href="#" className="block py-2 text-gray-600 hover:text-green-600 transition-colors">How It Works</a>
            <a href="#" className="block py-2 text-gray-600 hover:text-green-600 transition-colors">Contact</a>
          </div>
        )}
      </header>
    </div>
  )
}

export default Navbar