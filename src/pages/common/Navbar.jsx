import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import GoogleTranslate from "../../Translate";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/tools", label: "Tools" },
    { to: "/addtools", label: "Add Tool" },
    { to: "/map", label: "Map" },
    { to: "/forum", label: "Forum" },
    { to: "/calendar", label: "Calendar" },
    { to: "/videocall", label: "Video Call" },
    { to: "/setting", label: "Settings" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/soilAnalysis", label: "Soil Analysis" },
  ];

  const NavItem = ({ to, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
          isActive
            ? "bg-green-100 text-green-600"
            : "text-gray-600 hover:bg-gray-100"
        }`
      }
    >
      <span>{label}</span>
    </NavLink>
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <NavLink to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-800">FarmTools</h1>
          </NavLink>
          <nav className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <span>Logout</span>
              </button>
            ) : (
              <NavLink
                to="/login"
                className="flex items-center space-x-2 px-3 py-2 rounded text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <span>Login</span>
              </NavLink>
            )}
          </nav>
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "X" : "Menu"}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded text-gray-600 hover:bg-gray-100 transition-colors w-full"
            >
              <span>Logout</span>
            </button>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center space-x-2 px-3 py-2 rounded text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <span>Login</span>
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
