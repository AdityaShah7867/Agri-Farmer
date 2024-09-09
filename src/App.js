import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Landing from "./pages/Landing";
import Navbar from "./pages/common/Navbar";
import LoginPage from "./pages/auth/Login";
import ProductListingForm from "./pages/Tools/AddTools";
import AvailableToolsListing from "./pages/Tools/GetAvailable";


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