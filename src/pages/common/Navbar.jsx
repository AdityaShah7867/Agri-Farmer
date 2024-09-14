import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Tractor,
  Wrench,
  Search,
  Menu,
  X,
  ChevronRight,
  Star,
  Users,
  Clock,
  DollarSign,
  Leaf,
  ShieldCheck,
  Hammer,
  LogOut
} from "lucide-react";
import GoogleTranslate from "../../Translate";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <NavLink to="/" className="flex items-center space-x-2">
            <Tractor size={32} className="text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">FarmTools</h1>
          </NavLink>
          <nav className="hidden md:flex space-x-6">
            <NavLink
              to="/"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Home
            </NavLink>
            <NavLink
              to="/tools"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Tools
            </NavLink>
            <NavLink
              to="/addtools"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Add Tool
            </NavLink>
            <NavLink
              to="#"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Contact
            </NavLink>
            <NavLink
              to="/map"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              map
            </NavLink>
            <NavLink
              to="/forum"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Forum
            </NavLink>
            <NavLink
              to="/calendar"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Calendar
            </NavLink>
            <NavLink
              to="/videocall"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              VideoCall
            </NavLink>
            <NavLink
              to="/setting"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Setting
            </NavLink>
            {user ? (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-green-600 transition-colors flex items-center"
              >
                <LogOut size={18} className="mr-1" />
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Login
              </NavLink>
            )}
          </nav>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-4 px-4">
            <NavLink
              to="/"
              className="block py-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              Home
            </NavLink>
            <NavLink
              to="/tools"
              className="block py-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              Tools
            </NavLink>
            <NavLink
              to="/addtools"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Add Tool
            </NavLink>
            <NavLink
              to="#"
              className="block py-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              Contact
            </NavLink>
            {user ? (
              <button
                onClick={handleLogout}
                className="block py-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className="block py-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                Login
              </NavLink>
            )}
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;
