import React, { useState } from 'react';
import { Save, Bell, Shield, CreditCard, User, MapPin } from 'lucide-react';
// import GoogleTranslate from '../../Translate';

const Setting = () => {
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <User className="mr-2" />
          Account Information
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="name" name="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" name="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Bell className="mr-2" />
          Notifications
        </h2>
        <div className="flex items-center justify-between">
          <span>Receive email notifications</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={notifications} 
              onChange={() => setNotifications(!notifications)}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Shield className="mr-2" />
          Security
        </h2>
        <div className="flex items-center justify-between mb-4">
          <span>Enable Two-Factor Authentication</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={twoFactor} 
              onChange={() => setTwoFactor(!twoFactor)}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <button className="text-blue-600 hover:text-blue-800">Change Password</button>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <CreditCard className="mr-2" />
          Payment Information
        </h2>
        <p className="mb-2">Current Payment Method: Visa ending in 1234</p>
        <button className="text-blue-600 hover:text-blue-800">Update Payment Method</button>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <MapPin className="mr-2" />
          Location Preferences
        </h2>
        <div>
          <label htmlFor="radius" className="block text-sm font-medium text-gray-700">Tool Search Radius (km)</label>
          <input type="number" id="radius" name="radius" min="1" max="100" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
      </div>

      <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center">
        <Save className="mr-2" />
        Save Changes
      </button>
    </div>
  );
};

export default Setting;