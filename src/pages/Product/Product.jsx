import React, { useState } from 'react';
import { Share2 } from 'lucide-react';

const Product = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleMouseEnter = () => {
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  const productDetails = {
    name: "Heavy-Duty Tractor",
    description:
      "A powerful tractor suitable for large-scale farming operations. Ideal for plowing, tilling, and heavy hauling tasks.",
    imageUrl:
      "https://www.deere.co.in/assets/images/region-1/products/tractors/john-deere-e-series-cab.jpg",
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

  return (
    <div className=" mx-auto p-6 bg-white rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">Heavy-Duty Tractor</h1>
      <p className="text-gray-600 mb-6 text-center text-lg">
        A powerful tractor suitable for large-scale farming operations. Ideal
        for plowing, tilling, and heavy hauling tasks.
      </p>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <img
            src="https://www.deere.co.in/assets/images/region-1/products/tractors/john-deere-e-series-cab.jpg"
            alt="Heavy-Duty Tractor"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        <div className="lg:w-1/2">
          <button onClick={handleShare}
            className='bg-indigo-500 text-white hover:bg-indigo-600 transition-colors p-2 rounded-xl absolute right-10 '
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Share2 className="w-5 h-5" />
          </button>
          {showPopup && (
            <div className="bg-gray-200 text-gray-600 p-2 rounded-lg absolute mt-8 z-10 right-5 ">
              Share this product
            </div>
          )}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Product Quality</h2>
            <div className="flex items-center">
              <i className="fas fa-star text-yellow-400" />
              <i className="fas fa-star text-yellow-400" />
              <i className="fas fa-star text-yellow-400" />
              <i className="fas fa-star text-yellow-400" />
              <i className="fas fa-star text-gray-300" />
              <span className="ml-2 text-gray-600">(4/5)</span>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Pricing Tiers</h2>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>1 day:</span>
                <span className="font-semibold">$100/day</span>
              </li>
              <li className="flex justify-between items-center">
                <span>7 days:</span>
                <span className="font-semibold">$90/day</span>
              </li>
              <li className="flex justify-between items-center">
                <span>30 days:</span>
                <span className="font-semibold">$80/day</span>
              </li>
            </ul>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Dynamic Pricing Range
            </h2>
            <p className="text-gray-600">
              $80 - $100 per day (varies based on rental duration)
            </p>
          </div>
          <button className=" bg-green-500 text-white py-2 px-4 rounded-lg w-full mb-4 hover:bg-green-600 transition-colors">
            <i className="fas fa-shopping-cart" />
            Rent Now
          </button>

          <p className='text-xl font-semibold'>Owner Details:</p>
          <p className='mb-2'>Name: XYZ</p>
          <div className="flex flex-col sm:flex-row gap-4">

            <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
              <i className="fas fa-comment" />
              Chat
            </button>
            <button className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-600 transition-colors">
              <i className="fas fa-phone" />
              Call
            </button>
          </div>
          <button className="w-full mt-4 bg-purple-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors">
            <i className="fas fa-robot" />
            AI Assistance
          </button>
          {/* <button
            onClick={handleShare}
            className="w-full mt-4 bg-indigo-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Product;
