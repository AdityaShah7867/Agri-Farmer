import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { Camera, Loader, X } from 'lucide-react';
import { useTool } from '../../context/ToolContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductListingForm = () => {
  const { control, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      quantity: '',
      location: '',
      images: []
    }
  });

  const { addTool } = useTool();
  const images = watch('images');

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'images') {
        data[key].forEach(image => formData.append('images', image));
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      await addTool(formData);
      toast.success('Tool added successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add tool');
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setValue('images', files);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">List Your Equipment</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="md:flex">
            {/* Left column - Image upload */}
            <div className="md:w-1/2 p-8 bg-gray-50 border-r border-gray-200">
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Product Images
                </label>
                <div className="mt-1 flex flex-col items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-500 transition-colors duration-300">
                  {images && images.length > 0 ? (
                    images.map((image, index) => (
                      <div key={index} className="relative mb-4 w-full">
                        <img src={URL.createObjectURL(image)} alt={`Product ${index}`} className="mx-auto h-64 w-full object-cover rounded-lg shadow-md" />
                        <button
                          type="button"
                          onClick={() => setValue('images', images.filter((_, i) => i !== index))}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg hover:bg-red-100 transition-colors duration-300"
                        >
                          <X className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <Camera className="mx-auto h-16 w-16 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600 mt-4">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500 transition-colors duration-300">
                      <span>{images && images.length > 0 ? 'Change images' : 'Upload images'}</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" multiple />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB each</p>
                </div>
              </div>
            </div>

            {/* Right column - Form fields */}
            <div className="md:w-1/2 p-8">
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productName">
                  Tool Name
                </label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Product name is required' }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300"
                      type="text"
                      placeholder="Enter product name"
                    />
                  )}
                />
                      {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name.message}</p>}
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: 'Description is required' }}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300"
                      placeholder="Describe your product"
                      rows="4"
                    />
                  )}
                />
                {errors.description && <p className="text-red-500 text-xs italic mt-1">{errors.description.message}</p>}
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                  Price
                </label>
                <Controller
                  name="price"
                  control={control}
                  rules={{ required: 'Price is required', min: { value: 0, message: 'Price must be positive' } }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300"
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                    />
                  )}
                />
                {errors.price && <p className="text-red-500 text-xs italic mt-1">{errors.price.message}</p>}
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                  Quantity
                </label>
                <Controller
                  name="quantity"
                  control={control}
                  rules={{ required: 'Quantity is required', min: { value: 1, message: 'Quantity must be at least 1' } }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300"
                      placeholder="Enter quantity"
                      min="1"
                    />
                  )}
                />
                {errors.quantity && <p className="text-red-500 text-xs italic mt-1">{errors.quantity.message}</p>}
              </div>
              <div className="mb-8">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                  Location
                </label>
                <Controller
                  name="location"
                  control={control}
                  rules={{ required: 'Location is required' }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300"
                      placeholder="Enter location"
                    />
                  )}
                />
                {errors.location && <p className="text-red-500 text-xs italic mt-1">{errors.location.message}</p>}
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 ${
                    isSubmitting ? 'cursor-not-allowed opacity-70' : ''
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader className="h-6 w-6 animate-spin mr-2" />
                  ) : null}
                  {isSubmitting ? 'Submitting...' : 'Submit Listing'}
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
