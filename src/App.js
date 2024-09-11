import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Landing from "./pages/Landing";
import Navbar from "./pages/common/Navbar";
import LoginPage from "./pages/auth/Login";
import ProductListingForm from "./pages/Tools/AddTools";
import AvailableToolsListing from "./pages/Tools/GetAvailable";
import Map from "./pages/map/Map"
import Forum from "./pages/Forum/Forum";
import RentalCalendar from "./pages/Calender/page";
const App = () => {
  return (
    <>
    <Router>
      <>
        <Navbar/>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/addtools" element={<ProductListingForm />} />
          <Route path="/tools" element={<AvailableToolsListing />} />
          <Route path="/map" element={<Map />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/calendar" element={<RentalCalendar />} />
          {/* PRIVATE ROUTES BELOW THIS */}
          {/* <Route path="/" element={<Private />}>
            <Route path="/editcustomer" element={<CustomerEdiit />} />
          </Route> */}

          
        </Routes>
     </>
    </Router>
  </>
  )
}

export default App