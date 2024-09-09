import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Landing from "./pages/Landing";
import Navbar from "./pages/common/Navbar";


const App = () => {
  return (
    <>
    <Router>
      <>
        <Navbar/>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Landing />} />
          
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