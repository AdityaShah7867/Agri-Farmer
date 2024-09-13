import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Landing from "./pages/Landing";
import Navbar from "./pages/common/Navbar";
import LoginPage from "./pages/auth/Login";
import ProductListingForm from "./pages/Tools/AddTools";
import AvailableToolsListing from "./pages/Tools/GetAvailable";
import Map from "./pages/map/Map";
import Forum from "./pages/Forum/Forum";
import RentalCalendar from "./pages/Calender/page";
import Videocall from "./pages/video call/Videocall";
import Product from "./pages/Product/Product";
import Footer from "./pages/common/Footer";
import Setting from "./pages/Setting/Setting";
import MicrosoftTranslator from "./Translate";

const AppContent = () => {
  const location = useLocation(); // Now inside Router

  return (
    <>
      {/* Conditionally render Navbar if not on /videocall */}
      {location.pathname !== "/videocall" && <Navbar />}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/addtools" element={<ProductListingForm />} />
        <Route path="/tools" element={<AvailableToolsListing />} />
        <Route path="/map" element={<Map />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/calendar" element={<RentalCalendar />} />
        <Route path="/videocall" element={<Videocall />} />
        <Route path="/product" element={<Product />} />
        <Route path='/Setting' element={<Setting />} />
      </Routes>
      {location.pathname !== "/videocall" && <Footer />}

    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
