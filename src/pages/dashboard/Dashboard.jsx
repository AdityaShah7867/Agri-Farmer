import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sun, CloudRain, DollarSign, Tractor, CheckCircle, XCircle, X, Menu } from 'lucide-react';

const mockData = [
  { month: 'Jan', rentals: 20, shares: 15 },
  { month: 'Feb', rentals: 25, shares: 18 },
  { month: 'Mar', rentals: 30, shares: 22 },
  { month: 'Apr', rentals: 35, shares: 28 },
  { month: 'May', rentals: 40, shares: 32 },
  { month: 'Jun', rentals: 45, shares: 38 },
];

const mockRequests = [
  { id: 1, product: 'Tractor', requestedBy: 'John Doe', requestDate: '2024-09-20', status: 'pending' },
  { id: 2, product: 'Harvester', requestedBy: 'Jane Smith', requestDate: '2024-09-22', status: 'pending' },
  { id: 3, product: 'Seeder', requestedBy: 'Bob Johnson', requestDate: '2024-09-25', status: 'pending' },
];

const mockMarketPrices = [
  { product: 'Wheat', price: 7.25, unit: 'bushel' },
  { product: 'Corn', price: 6.50, unit: 'bushel' },
  { product: 'Soybeans', price: 14.75, unit: 'bushel' },
  { product: 'Rice', price: 13.90, unit: 'hundredweight' },
  { product: 'Cotton', price: 0.88, unit: 'pound' },
];

const WeatherModal = ({ isOpen, onClose }) => {
  // ... (WeatherModal component remains unchanged)
};

const MarketPricesSidebar = ({ isOpen, onClose }) => (
  <div className={`bg-white w-64 h-full fixed left-0 top-0 overflow-y-auto shadow-lg p-6 pt-20 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
    <div className="flex justify-between items-center mb-4 md:hidden">
      <h2 className="text-2xl font-bold">Market Prices</h2>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <X size={24} />
      </button>
    </div>
    <h2 className="text-2xl font-bold mb-4 hidden md:block">Market Prices</h2>
    <ul>
      {mockMarketPrices.map((item, index) => (
        <li key={index} className="mb-4 pb-2 border-b last:border-b-0">
          <p className="font-semibold">{item.product}</p>
          <p>${item.price.toFixed(2)} per {item.unit}</p>
        </li>
      ))}
    </ul>
  </div>
);

const VerticalMarketPricesButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed left-0 top-1/2 pt-8 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-r-md shadow-lg transform -rotate-90 origin-left md:hidden"
  >
    <span className="flex items-center">
      <Menu size={20} className="mr-2" />
      Market Prices
    </span>
  </button>
);

const Dashboard = () => {
  const [requests, setRequests] = useState(mockRequests);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isMarketPricesSidebarOpen, setIsMarketPricesSidebarOpen] = useState(false);

  const handleRequestAction = (id, action) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: action } : req
    ));
  };

  const acceptedCount = requests.filter(req => req.status === 'accepted').length;
  const rejectedCount = requests.filter(req => req.status === 'rejected').length;
  const pendingCount = requests.filter(req => req.status === 'pending').length;

  return (
    <div className="min-h-screen pl-4 bg-gray-100">
      <MarketPricesSidebar isOpen={isMarketPricesSidebarOpen} onClose={() => setIsMarketPricesSidebarOpen(false)} />
      <VerticalMarketPricesButton onClick={() => setIsMarketPricesSidebarOpen(!isMarketPricesSidebarOpen)} />
      <div className="md:pl-64">
        <div className="p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Farmer's Portal Dashboard</h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow cursor-pointer" onClick={() => setIsWeatherModalOpen(true)}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Weather Forecast</h2>
                <Sun className="text-yellow-500" size={24} />
              </div>
              <p className="mt-2 text-gray-600">Click to view details</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Available Equipment</h2>
                <Tractor className="text-blue-500" size={24} />
              </div>
              <p className="mt-2 text-gray-600">15 items available</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Equipment Usage Analytics</h2>
                <CloudRain className="text-purple-500" size={24} />
              </div>
              <p className="mt-2 text-gray-600">Usage up 12% this month</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Equipment Usage Analytics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rentals" fill="#3B82F6" name="Rentals" />
                <Bar dataKey="shares" fill="#10B981" name="Shares" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Request Management</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800">Accepted</h3>
                <p className="text-3xl font-bold text-green-600">{acceptedCount}</p>
              </div>
              <div className="bg-red-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800">Rejected</h3>
                <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800">Pending</h3>
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Product</th>
                    <th className="py-2 px-4 text-left">Requested By</th>
                    <th className="py-2 px-4 text-left">Request Date</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-b">
                      <td className="py-2 px-4">{request.product}</td>
                      <td className="py-2 px-4">{request.requestedBy}</td>
                      <td className="py-2 px-4">{request.requestDate}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          request.status === 'accepted' ? 'bg-green-200 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-200 text-red-800' :
                          'bg-yellow-200 text-yellow-800'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleRequestAction(request.id, 'accepted')}
                              className="mr-2 text-green-600 hover:text-green-800"
                            >
                              <CheckCircle size={20} />
                            </button>
                            <button
                              onClick={() => handleRequestAction(request.id, 'rejected')}
                              className="text-red-600 hover:text-red-800"
                            >
                              <XCircle size={20} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <WeatherModal isOpen={isWeatherModalOpen} onClose={() => setIsWeatherModalOpen(false)} />
    </div>
  );
};

export default Dashboard;