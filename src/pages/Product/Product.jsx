import React, { useEffect, useState } from 'react';
import { Share2, Calendar } from 'lucide-react';
import { useTool } from '../../context/ToolContext';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion'; 
import { toast } from 'react-toastify';

const url=`${process.env.REACT_APP_BACKEND_URL}/api/rental/book`

const Product = () => {
  const { id } = useParams();
  const { getToolById } = useTool();
  const [tool, setTool] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showRentModal, setShowRentModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [quantity, setQuantity] = useState(1);


  const bookRental = async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          equipmentId: id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          quantity: quantity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to book rental');
      }

      const data = await response.json();
      console.log('Rental booked successfully:', data);
      toast.success('Rental booked successfully');
    } catch (error) {
      console.error('Error booking rental:', error);
      toast.error('Error booking rental');
    }
  }
  

  useEffect(() => {
    const fetchTool = async () => {
      const toolData = await getToolById(id);
      setTool(toolData);
    };
    fetchTool();
  }, [getToolById, id]);

  const handleMouseEnter = () => {
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  const productDetails = {
    id: tool?.id,
    name: tool?.name, 
    description: tool?.description,
    pricePerDay: tool?.pricePerDay ? tool.pricePerDay.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : null,
    priceFor7Days: tool?.pricePerDay ? (tool.pricePerDay * 7 * 0.9 / 7).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : null, // 10% discount
    priceFor30Days: tool?.pricePerDay ? (tool.pricePerDay * 30 * 0.75 / 30).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : null,// 25% discount
    pricelastrange: tool?.pricePerDay ? (tool.pricePerDay * 30 * 0.65 / 30).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : null, // 35% discount 
    imageUrl:
      `${process.env.REACT_APP_BACKEND_URL}/${tool?.images[0]}`,
    url: window.location.href, // The current page URL
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productDetails.name,
          text: productDetails.description,
          url: productDetails.url,
        });
        console.log("Shared successfully");
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareUrl = `https://wa.me/?text=${encodeURIComponent(
        `Check out this ${productDetails.name}!\n\n${productDetails.description}\n\n${productDetails.url}`
      )}`;
      window.open(shareUrl, "_blank");
    }
  };

  const handleRentNow = () => {
    setShowRentModal(true);
  };

  const handleCloseModal = () => {
    setShowRentModal(false);
    setStartDate(null);
    setEndDate(null);
    setTotalCost(0);
    setQuantity(1);
  };

  const calculateCost = () => {
    if (startDate && endDate && tool?.pricePerDay) {
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
      let cost;
      if (days <= 7) {
        cost = days * tool.pricePerDay;
      } else if (days <= 30) {
        cost = days * tool.pricePerDay * 0.9; // 10% discount
      } else {
        cost = days * tool.pricePerDay * 0.75; // 25% discount
      }
      setTotalCost(cost * quantity);
    }
  };

  useEffect(() => {
    calculateCost();
  }, [startDate, endDate, quantity]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="md:flex">
            {/* Left column - Product Image */}
            <div className="md:w-1/2">
              <div className="h-96 relative">
                <img
                  src={productDetails.imageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGY6b7YqSv02iiBVLEoVUx10301RnmFA1x3BLU61s-qnicrJSzIEmPHgPIGQxclEXbC2k&usqp=CAU'}
                  alt={productDetails.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGY6b7YqSv02iiBVLEoVUx10301RnmFA1x3BLU61s-qnicrJSzIEmPHgPIGQxclEXbC2k&usqp=CAU';
                  }}
                />
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className='absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300'
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </motion.button>
                {showPopup && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-14 right-4 bg-white text-gray-600 p-2 rounded-lg shadow-md"
                  >
                    Share this product
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Right column - Product Details */}
            <div className="md:w-1/2 p-8">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold mb-4 text-gray-800"
              >
                {productDetails.name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-gray-600 mb-6 text-lg"
              >
                {productDetails.description}
              </motion.p>
              
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Product Quality</h2>
                <div className="flex items-center">
                  {[1, 2, 3, 4].map((star) => (
                    <motion.i 
                      key={star}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: star * 0.1 }}
                      className="fas fa-star text-yellow-400 text-2xl mr-1"
                    />
                  ))}
                  <motion.i 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="fas fa-star text-gray-300 text-2xl mr-1"
                  />
                  <span className="ml-2 text-gray-600 text-lg">(4/5)</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Pricing Tiers</h2>
                <ul className="space-y-3">
                  {[
                    { label: '1 day:', price: productDetails.pricePerDay },
                    { label: '7 days:', price: productDetails.priceFor7Days },
                    { label: '30 days:', price: productDetails.priceFor30Days }
                  ].map((tier, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex justify-between items-center bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                    >
                      <span className="text-lg">{tier.label}</span>
                      <span className="font-semibold text-lg">${tier.price}/day</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-500 text-white py-3 px-6 rounded-lg w-full mb-4 hover:bg-green-600 transition-colors text-xl font-semibold shadow-md"
                onClick={handleRentNow}
              >
                <i className="fas fa-shopping-cart mr-2" />
                Rent Now
              </motion.button>
              
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Owner Details</h2>
                <div className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                  <p className="mb-2 text-lg"><span className="font-semibold">Name:</span> {tool?.owner?.name}</p>
                  <p className="mb-2 text-lg"><span className="font-semibold">Email:</span> {tool?.owner?.email}</p>
                  <p className="mb-2 text-lg"><span className="font-semibold">Phone:</span> {tool?.owner?.phone}</p>
                </div>
                <div className="flex mt-4 space-x-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors text-lg font-semibold shadow-md"
                  >
                    <i className="fas fa-comment" />
                    Chat
                  </motion.button>
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href='' 
                    className="flex-1 bg-yellow-500 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-600 transition-colors text-lg font-semibold shadow-md"
                  >
                    <i className="fas fa-phone" />
                    Call
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showRentModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white p-8 rounded-lg w-96 shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-6">Rent {productDetails.name}</h2>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-2">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg"
              />
            </div>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-2">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg"
              />
            </div>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg"
              />
            </div>
            {totalCost > 0 && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-semibold mb-6"
              >
                Total Cost: {totalCost.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
              </motion.p>
            )}
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg mr-4 text-lg font-semibold hover:bg-gray-400 transition-colors duration-300"
                onClick={handleCloseModal}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors duration-300"
                onClick={() => {
                  
                  bookRental()
            
                }}
              >
                Confirm Rent
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Product;
