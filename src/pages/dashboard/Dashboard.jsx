import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sun, Cloud, CloudRain, Wind, Droplets, Search, MapPin, X, Menu, Tractor, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const urlOwner = `${process.env.REACT_APP_BACKEND_URL}/api/rental/getRequestsForOwner`;
const urlFarmer = `${process.env.REACT_APP_BACKEND_URL}/api/rental/getRequestsForFarmer`;
const urlAdmin = `${process.env.REACT_APP_BACKEND_URL}/api/rental/getForAdmin`;
const urlReject = `${process.env.REACT_APP_BACKEND_URL}/api/rental/reject/rentalId`;
const mockData = [
  { month: 'Jan', rentals: 20, shares: 15 },
  { month: 'Feb', rentals: 25, shares: 18 },
  { month: 'Mar', rentals: 30, shares: 22 },
  { month: 'Apr', rentals: 35, shares: 28 },
  { month: 'May', rentals: 40, shares: 32 },
  { month: 'Jun', rentals: 45, shares: 38 },
];


const mockMarketPrices = [
  { product: 'Wheat', price: 7.25, unit: 'bushel' },
  { product: 'Corn', price: 6.50, unit: 'bushel' },
  { product: 'Soybeans', price: 14.75, unit: 'bushel' },
  { product: 'Rice', price: 13.90, unit: 'hundredweight' },
  { product: 'Cotton', price: 0.88, unit: 'pound' },
];

const mockAvailableEquipment = [
  { id: 1, name: 'Tractor', brand: 'John Deere', model: '8R 410', status: 'Available' },
  { id: 2, name: 'Harvester', brand: 'Case IH', model: 'Axial-Flow 250 Series', status: 'In Use' },
  { id: 3, name: 'Seeder', brand: 'Kinze', model: '3660', status: 'Available' },
  { id: 4, name: 'Sprayer', brand: 'Apache', model: 'AS1250', status: 'Maintenance' },
  { id: 5, name: 'Plow', brand: 'Kuhn', model: 'Multi-Leader', status: 'Available' },
];

const WeatherIcon = ({ condition, className }) => {
  const iconClass = `w-12 h-12 ${className}`;
  switch (condition.toLowerCase()) {
    case 'sunny':
    case 'clear':
      return <Sun className={`${iconClass} text-yellow-400`} />;
    case 'partly cloudy':
    case 'cloudy':
      return <Cloud className={`${iconClass} text-gray-400`} />;
    case 'rain':
    case 'light rain':
    case 'moderate rain':
      return <CloudRain className={`${iconClass} text-blue-400`} />;
    case 'heavy rain':
      return <Droplets className={`${iconClass} text-blue-600`} />;
    default:
      return <Sun className={`${iconClass} text-yellow-400`} />;
  }
};

const WeatherModal = ({ isOpen, onClose }) => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchWeatherByGeolocation();
    }
  }, [isOpen]);

  const fetchWeatherByGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`${latitude},${longitude}`);
        },
        err => {
          setError("Unable to retrieve your location. Please enter a city name.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Please enter a city name.");
      setLoading(false);
    }
  };

  const fetchWeather = async (query) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=3&aqi=no&alerts=no`
      );
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      const data = await response.json();
      setWeather(data);
      setLocation(data.location.name);
      setLoading(false);
    } catch (err) {
      setError('Error fetching weather data. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location) {
      setLoading(true);
      fetchWeather(location);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-blue-800">Weather Forecast</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city name"
                className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-blue-300 focus:border-blue-500 focus:outline-none transition-colors"
              />
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
            </div>
            <button type="submit" className="ml-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300 flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search
            </button>
          </div>
        </form>

        {loading && <p className="text-center text-xl">Loading weather data...</p>}
        {error && <p className="text-center text-xl text-red-500">{error}</p>}

        {weather && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-semibold text-blue-800">{weather.location.name}</h2>
                <p className="text-lg text-gray-600">{new Date(weather.location.localtime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <WeatherIcon condition={weather.current.condition.text} className="mr-4" />
                  <div>
                    <p className="text-5xl font-bold text-blue-600">{weather.current.temp_c}°C</p>
                    <p className="text-xl text-gray-600">{weather.current.condition.text}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="flex items-center justify-end text-gray-600">
                    <Droplets className="h-5 w-5 mr-2 text-blue-400" />
                    Feels like {weather.current.feelslike_c}°C
                  </p>
                  <p className="flex items-center justify-end mt-2 text-gray-600">
                    <Wind className="h-5 w-5 mr-2 text-blue-400" />
                    Wind {weather.current.wind_kph} km/h
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4 text-blue-800">3-Day Forecast</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {weather.forecast.forecastday.map((day) => (
                  <div key={day.date} className="bg-white rounded-xl shadow-lg p-4 transition-all duration-300 hover:shadow-xl">
                    <h4 className="text-xl font-semibold mb-2 text-blue-700">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}
                    </h4>
                    <div className="flex items-center justify-between">
                      <WeatherIcon condition={day.day.condition.text} className="mr-4" />
                      <div className="text-right">
                        <p className="text-3xl font-bold text-blue-600">{day.day.avgtemp_c}°C</p>
                        <p className="text-gray-600">{day.day.condition.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EquipmentModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Available Equipment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Brand</th>
                <th className="py-2 px-4 text-left">Model</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockAvailableEquipment.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">{item.brand}</td>
                  <td className="py-2 px-4">{item.model}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'Available' ? 'bg-green-200 text-green-800' :
                        item.status === 'In Use' ? 'bg-blue-200 text-blue-800' :
                          'bg-yellow-200 text-yellow-800'
                      }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
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

  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isMarketPricesSidebarOpen, setIsMarketPricesSidebarOpen] = useState(false);
  const [requestsOwner, setRequestsOwner] = useState([]);
  const [requestsFarmer, setRequestsFarmer] = useState([]);

  const { user, logout } = useAuth();

  const getRequestsOwner = async () => {
    const response = await fetch(urlOwner, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    setRequestsOwner(data);
  };

  const getRequestsFarmer = async () => {
    const response = await fetch(urlFarmer, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    setRequestsFarmer(data);
  };
  
  useEffect(() => {
    getRequestsOwner();
    getRequestsFarmer();
  }, []);

  const handleRequestAction = async (id, action) => {
    setRequestsOwner(requestsOwner.map(req =>
      req.id === id ? { ...req, status: action } : req
    ));

    const urlAccept = `${process.env.REACT_APP_BACKEND_URL}/api/rental/accept/${id}`;
    const response = await fetch(urlAccept, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      console.log('Request Accepted successful');
    } else {
      console.log('Request action failed');
    }
  };

  const acceptedCount = requestsOwner.filter(req => req.status === 'ACCEPTED').length;
  const rejectedCount = requestsOwner.filter(req => req.status === 'REJECTED').length;
  const pendingCount = requestsOwner.filter(req => req.status === 'PENDING').length;

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
            <div className="bg-white p-6 rounded-lg shadow cursor-pointer" onClick={() => setIsEquipmentModalOpen(true)}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Available Equipment</h2>
                <Tractor className="text-blue-500" size={24} />
              </div>
              <p className="mt-2 text-gray-600">Click to view details</p>
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

          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Request Management (As Owner)</h2>
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
                    <th className="py-2 px-4 text-left">Equipment</th>
                    <th className="py-2 px-4 text-left">Requested By</th>
                    <th className="py-2 px-4 text-left">Start Date</th>
                    <th className="py-2 px-4 text-left">End Date</th>
                    <th className="py-2 px-4 text-left">Price</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requestsOwner.map((request) => (
                    <tr key={request.id} className="border-b">
                      <td className="py-2 px-4">{request.equipment.name}</td>
                      <td className="py-2 px-4">{request.farmer.name}</td>
                      <td className="py-2 px-4">{new Date(request.startDate).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{new Date(request.endDate).toLocaleDateString()}</td>
                      <td className="py-2 px-4">${request.price}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          request.status === 'ACCEPTED' ? 'bg-green-200 text-green-800' :
                          request.status === 'REJECTED' ? 'bg-red-200 text-red-800' :
                          'bg-yellow-200 text-yellow-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {request.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleRequestAction(request.id, 'ACCEPTED')}
                              className="mr-2 text-green-600 hover:text-green-800"
                            >
                              <CheckCircle size={20} />
                            </button>
                            <button
                              onClick={() => handleRequestAction(request.id, 'REJECTED')}
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

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Requests (As Farmer)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Equipment</th>
                    <th className="py-2 px-4 text-left">Owner</th>
                    <th className="py-2 px-4 text-left">Start Date</th>
                    <th className="py-2 px-4 text-left">End Date</th>
                    <th className="py-2 px-4 text-left">Price</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requestsFarmer.map((request) => (
                    <tr key={request.id} className="border-b">
                      <td className="py-2 px-4">{request.equipment.name}</td>
                      <td className="py-2 px-4">{request.equipment.owner.name}</td>
                      <td className="py-2 px-4">{new Date(request.startDate).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{new Date(request.endDate).toLocaleDateString()}</td>
                      <td className="py-2 px-4">${request.price}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          request.status === 'ACCEPTED' ? 'bg-green-200 text-green-800' :
                          request.status === 'REJECTED' ? 'bg-red-200 text-red-800' :
                          'bg-yellow-200 text-yellow-800'
                        }`}>
                          {request.status}
                        </span>
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
      <EquipmentModal isOpen={isEquipmentModalOpen} onClose={() => setIsEquipmentModalOpen(false)} />
    </div>
  );
};

export default Dashboard;