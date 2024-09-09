import React, { useState } from 'react';
import { Camera, Plus, Minus, Star, DollarSign, Loader, X } from 'lucide-react';

const ProductListingForm = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [quality, setQuality] = useState(5);
  const [image, setImage] = useState(null);
  const [pricingTiers, setPricingTiers] = useState([
    { days: 1, price: '' },
    { days: 3, price: '' },
    { days: 7, price: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleQualityChange = (newQuality) => {
    setQuality(Math.max(1, Math.min(5, newQuality)));
  };

  const handlePricingChange = (index, field, value) => {
    const newPricingTiers = [...pricingTiers];
    newPricingTiers[index][field] = value;
    setPricingTiers(newPricingTiers);
  };

  const addPricingTier = () => {
    setPricingTiers([...pricingTiers, { days: '', price: '' }]);
  };

  const removePricingTier = (index) => {
    const newPricingTiers = pricingTiers.filter((_, i) => i !== index);
    setPricingTiers(newPricingTiers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Here you would typically send the data to your backend
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating API call
    console.log({ productName, description, quality, image, pricingTiers });
    setIsSubmitting(false);
    // Reset form or show success message
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">List Your Product for Rent</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="md:flex">
            {/* Left column - Image upload */}
            <div className="md:w-1/3 p-8 bg-white border-r border-gray-200">
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Product Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {image ? (
                      <div className="relative">
                        <img src={image} alt="Product" className="mx-auto h-64 w-full object-cover rounded-md" />
                        <button
                          type="button"
                          onClick={() => setImage(null)}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                        >
                          <X className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    ) : (
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                        <span>{image ? 'Change photo' : 'Upload a photo'}</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Product Quality
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 cursor-pointer ${star <= quality ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      onClick={() => handleQualityChange(star)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - Form fields */}
            <div className="md:w-2/3 p-8">
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productName">
                  Product Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="productName"
                  type="text"
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  placeholder="Describe your product"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Pricing Tiers
                </label>
                {pricingTiers.map((tier, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="number"
                      className="shadow appearance-none border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                      placeholder="Days"
                      value={tier.days}
                      onChange={(e) => handlePricingChange(index, 'days', e.target.value)}
                      min="1"
                      required
                    />
                    <span className="mr-2">days for</span>
                    <DollarSign className="h-5 w-5 text-gray-400 mr-1" />
                    <input
                      type="number"
                      className="shadow appearance-none border rounded w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Price"
                      value={tier.price}
                      onChange={(e) => handlePricingChange(index, 'price', e.target.value)}
                      min="0"
                      step="0.01"
                      required
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removePricingTier(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPricingTier}
                  className="mt-2 flex items-center text-sm text-green-600 hover:text-green-500"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add another pricing tier
                </button>
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Submitting...
                    </>
                  ) : (
                    'List Product'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductListingForm;