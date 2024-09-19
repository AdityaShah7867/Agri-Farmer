import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeatherAlertIcon = ({ type }) => {
  const iconClass = "w-6 h-6";
  switch (type.toLowerCase()) {
    case 'rain': return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;
    case 'heat': return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
    case 'wind': return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>;
    default: return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
  }
};

const CropInfo = ({ selectedCrop }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
    <h2 className="text-2xl font-semibold mb-4 text-green-700">{selectedCrop.name}</h2>
    <p className="text-gray-600 mb-2 font-medium">{selectedCrop.type}</p>
    <p className="mb-1"><strong>Planting Date:</strong> {new Date(selectedCrop.plantingDate).toLocaleDateString()}</p>
    <p className="mb-1"><strong>Expected Harvest:</strong> {new Date(selectedCrop.expectedHarvestDate).toLocaleDateString()}</p>
    <p><strong>Growth Stage:</strong> {selectedCrop.currentGrowthStage}</p>
  </div>
);

const WeatherAlerts = ({ weatherAlerts }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
    <h2 className="text-2xl font-semibold mb-4 text-blue-700">Weather Alerts</h2>
    {weatherAlerts.map(alert => (
      <div key={alert.id} className="flex items-center mb-2 p-3 bg-blue-100 rounded-lg">
        <WeatherAlertIcon type={alert.type} />
        <div className="ml-3">
          <p className="font-semibold text-blue-800">{alert.type}</p>
          <p className="text-sm text-blue-600">{alert.description}</p>
        </div>
      </div>
    ))}
  </div>
);

const WeatherForecast = ({ weatherForecast }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
    <h2 className="text-2xl font-semibold mb-4 text-yellow-700">Weather Forecast</h2>
    {weatherForecast.map((forecast, index) => (
      <div key={index} className="mb-3 p-3 bg-yellow-50 rounded-lg">
        <p className="font-semibold text-yellow-800">{new Date(forecast.dt * 1000).toLocaleDateString()}</p>
        <p className="text-yellow-700">{forecast.weather[0].main}: {forecast.weather[0].description}</p>
        <p className="text-yellow-600">Temperature: {(forecast.main.temp - 273.15).toFixed(1)}°C</p>
      </div>
    ))}
  </div>
);



const Tasks = ({ tasks, selectedCrop }) => {

    useEffect(() => {
       console.log('selected crop', selectedCrop)
      }, [selectedCrop]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localTasks, setLocalTasks] = useState(tasks);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    dueDate: "",
    completed: false,
  });

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const getCropTasks = async (cropId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      const baseURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.get(`${baseURL}/api/crop/tasks/get/${cropId}`, { headers });
      setLocalTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  useEffect(() => {
    if (selectedCrop && selectedCrop.id) {
      getCropTasks(selectedCrop.id);
    }
  }, [selectedCrop]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const formattedTask = {
        name: newTask.name,
        description: newTask.description,
        dueDate: new Date(newTask.dueDate).toISOString(),
        completed: false
      };

      const response = await axios.post(`${baseURL}/api/crop/tasks/create/${selectedCrop.id}`, formattedTask, { headers });
      
      if (response.status === 201) {
        getCropTasks(selectedCrop.id);
        setIsModalOpen(false);
        setNewTask({ name: "", description: "", dueDate: "", completed: false });
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-purple-700">Tasks</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
        >
          Add Task
        </button>
      </div>
      <ul className="space-y-2">
        {localTasks.map(task => (
          <li key={task.id} className="flex items-center bg-purple-50 p-3 rounded-lg">
            <input type="checkbox" className="mr-3 form-checkbox h-5 w-5 text-purple-600" checked={task.completed} />
            <span className="text-purple-800">{task.name}: {task.description}</span>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Add New Task</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="name" name="name" value={newTask.name} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50" />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" name="description" value={newTask.description} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                <input type="date" id="dueDate" name="dueDate" value={newTask.dueDate} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50" />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const PestIssues = ({ pestIssues }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
    <h2 className="text-2xl font-semibold mb-4 text-red-700">Pest Issues</h2>
    {pestIssues.map(issue => (
      <div key={issue.id} className="mb-3 bg-red-50 p-3 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-red-800 font-medium">{issue.pestName}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            issue.severity === 'High' ? 'bg-red-200 text-red-800' :
            issue.severity === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
            'bg-green-200 text-green-800'
          }`}>
            {issue.severity}
          </span>
        </div>
      </div>
    ))}
  </div>
);

const Yields = ({ yields }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
    <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Yields</h2>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={yields}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="quantity" stroke="#4F46E5" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const ResourceUsage = ({ resourceUsage }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
    <h2 className="text-2xl font-semibold mb-4 text-teal-700">Resource Usage</h2>
    {resourceUsage.map(usage => (
      <div key={usage.id} className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-teal-800 font-medium">{usage.resourceType}</span>
          <span className="text-teal-600">{usage.amount} {usage.unit}</span>
        </div>
        <div className="w-full bg-teal-200 rounded-full h-2.5">
          <div
            className="bg-teal-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(usage.amount / usage.max) * 100}%` }}
          ></div>
        </div>
      </div>
    ))}
  </div>
);

const MarketPrices = ({ marketPrices }) => (
  <div className="mt-8 bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
    <h2 className="text-2xl font-semibold mb-4 text-green-700">Market Prices</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={marketPrices}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const AddCropModal = ({ isOpen, onClose, onSubmit, newCrop, handleInputChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" id="my-modal">
      <div className="relative p-8 border w-full max-w-md shadow-lg rounded-lg bg-white">
        <h3 className="text-2xl font-bold text-green-700 mb-6">Add New Crop</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Crop Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newCrop.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Crop Type</label>
            <select
              id="type"
              name="type"
              value={newCrop.type}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            >
              <option value="">Select a crop type</option>
              <option value="Grain">Grain</option>
              <option value="Vegetable">Vegetable</option>
              <option value="Fruit">Fruit</option>
              <option value="Legume">Legume</option>
              <option value="Root">Root</option>
              <option value="Oilseed">Oilseed</option>
            </select>
          </div>
          <div>
            <label htmlFor="plantingDate" className="block text-sm font-medium text-gray-700">Planting Date</label>
            <input
              type="date"
              id="plantingDate"
              name="plantingDate"
              value={newCrop.plantingDate}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="expectedHarvestDate" className="block text-sm font-medium text-gray-700">Expected Harvest Date</label>
            <input
              type="date"
              id="expectedHarvestDate"
              name="expectedHarvestDate"
              value={newCrop.expectedHarvestDate}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="currentGrowthStage" className="block text-sm font-medium text-gray-700">Current Growth Stage</label>
            <select
              id="currentGrowthStage"
              name="currentGrowthStage"
              value={newCrop.currentGrowthStage}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            >
              <option value="">Select a growth stage</option>
              <option value="Germination">Germination</option>
              <option value="Seedling">Seedling</option>
              <option value="Vegetative">Vegetative</option>
              <option value="Flowering">Flowering</option>
              <option value="Fruiting">Fruiting</option>
              <option value="Ripening">Ripening</option>
            </select>
          </div>
          <div>
            <label htmlFor="soilMoisture" className="block text-sm font-medium text-gray-700">Soil Moisture</label>
            <input
              type="number"
              id="soilMoisture"
              name="soilMoisture"
              value={newCrop.soilMoisture}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="soilNitrogen" className="block text-sm font-medium text-gray-700">Soil Nitrogen</label>
            <input
              type="number"
              id="soilNitrogen"
              name="soilNitrogen"
              value={newCrop.soilNitrogen}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="soilPhosphorus" className="block text-sm font-medium text-gray-700">Soil Phosphorus</label>
            <input
              type="number"
              id="soilPhosphorus"
              name="soilPhosphorus"
              value={newCrop.soilPhosphorus}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="soilPotassium" className="block text-sm font-medium text-gray-700">Soil Potassium</label>
            <input
              type="number"
              id="soilPotassium"
              name="soilPotassium"
              value={newCrop.soilPotassium}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
            >
              Add Crop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CropDashboard = () => {
  const [crops, setCrops] = useState([]);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [pestIssues, setPestIssues] = useState([]);
  const [yields, setYields] = useState([]);
  const [resourceUsage, setResourceUsage] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCrop, setNewCrop] = useState({
    name: "",
    type: "",
    plantingDate: "",
    expectedHarvestDate: "",
    currentGrowthStage: "",
    soilMoisture: 0,
    soilNitrogen: 0,
    soilPhosphorus: 0,
    soilPotassium: 0,
  });
  const [updateCrop, setUpdateCrop] = useState({
    id: "",
    name: "",
    type: "",
    plantingDate: "",
    expectedHarvestDate: "",
    currentGrowthStage: "",
    soilMoisture: 0,
    soilNitrogen: 0,
    soilPhosphorus: 0,
    soilPotassium: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const baseURL = process.env.REACT_APP_BACKEND_URL;

        // Get current location
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;

        // Individual API calls
        const cropsRes = await axios.get(`${baseURL}/api/crop/get`, { headers });
        const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=38023a0d5a7ad16d60ceb291baf8afb3`);
        const forecastRes = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=38023a0d5a7ad16d60ceb291baf8afb3`);
        // const tasksRes = await axios.get(`${baseURL}/api/tasks`, { headers });
        // const pestsRes = await axios.get(`${baseURL}/api/pest-issues`, { headers });
        // const yieldsRes = await axios.get(`${baseURL}/api/yields`, { headers });
        // const resourceRes = await axios.get(`${baseURL}/api/resource-usage`, { headers });
        // const pricesRes = await axios.get(`${baseURL}/api/market-prices`, { headers });

        setCrops(cropsRes.data);
        setWeatherAlerts([{ id: 1, type: weatherRes.data.weather[0].main, description: weatherRes.data.weather[0].description }]);
        setWeatherForecast(forecastRes.data.list.slice(0, 5)); // Get the first 5 forecast entries
        // setTasks(tasksRes.data);
        // setPestIssues(pestsRes.data);
        // setYields(yieldsRes.data);
        // setResourceUsage(resourceRes.data);
        // setMarketPrices(pricesRes.data);

        if (cropsRes.data.length > 0) {
          setSelectedCrop(cropsRes.data[0]);
        }
      } catch (error) {
        setError('An error occurred while fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addCrop = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      // Convert date strings to ISO format
      const formattedCrop = {
        ...newCrop,
        plantingDate: new Date(newCrop.plantingDate).toISOString(),
        expectedHarvestDate: new Date(newCrop.expectedHarvestDate).toISOString(),
        soilMoisture: Number(newCrop.soilMoisture),
        soilNitrogen: Number(newCrop.soilNitrogen),
        soilPhosphorus: Number(newCrop.soilPhosphorus),
        soilPotassium: Number(newCrop.soilPotassium),
      };

      const response = await axios.post(`${baseURL}/api/crop/create`, formattedCrop, { headers });
      
      if (response.status === 201) {
        // Refresh the crops list after adding a new crop
        const cropsRes = await axios.get(`${baseURL}/api/crop/get`, { headers });
        setCrops(cropsRes.data);
        if (cropsRes.data.length > 0) {
          setSelectedCrop(cropsRes.data[0]);
        }
        setIsModalOpen(false);
        setNewCrop({
          name: "",
          type: "",
          plantingDate: "",
          expectedHarvestDate: "",
          currentGrowthStage: "",
          soilMoisture: 0,
          soilNitrogen: 0,
          soilPhosphorus: 0,
          soilPotassium: 0,
        });
      }
    } catch (error) {
      setError('An error occurred while adding a new crop. Please try again later.');
      console.error('Error details:', error.response ? error.response.data : error.message);
    }
  };

  const updateCropState = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      // Convert date strings to ISO format
      const formattedCrop = {
        ...updateCrop,
        plantingDate: new Date(updateCrop.plantingDate).toISOString(),
        expectedHarvestDate: new Date(updateCrop.expectedHarvestDate).toISOString(),
        soilMoisture: Number(updateCrop.soilMoisture),
        soilNitrogen: Number(updateCrop.soilNitrogen),
        soilPhosphorus: Number(updateCrop.soilPhosphorus),
        soilPotassium: Number(updateCrop.soilPotassium),
      };

      const response = await axios.put(`${baseURL}/api/crop/update/${updateCrop.id}`, formattedCrop, { headers });
      
      if (response.status === 200) {
        // Refresh the crops list after updating the crop
        const cropsRes = await axios.get(`${baseURL}/api/crop/get`, { headers });
        setCrops(cropsRes.data);
        if (cropsRes.data.length > 0) {
          setSelectedCrop(cropsRes.data.find(crop => crop.id === updateCrop.id) || cropsRes.data[0]);
        }
        setIsModalOpen(false);
        setUpdateCrop({
          id: "",
          name: "",
          type: "",
          plantingDate: "",
          expectedHarvestDate: "",
          currentGrowthStage: "",
          soilMoisture: 0,
          soilNitrogen: 0,
          soilPhosphorus: 0,
          soilPotassium: 0,
        });
      }
    } catch (error) {
      setError('An error occurred while updating the crop. Please try again later.');
      console.error('Error details:', error.response ? error.response.data : error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCrop(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateCrop(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4" role="alert">{error}</div>;
  }

  if (crops.length === 0) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 m-4" role="alert">
        No crop data found.
        <button onClick={() => setIsModalOpen(true)} className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300">
          Add Crop
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-green-700">Crop Management Dashboard</h1>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {crops.map((crop) => (
            <button
              key={crop.id}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition duration-300 ${
                selectedCrop && selectedCrop.id === crop.id
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-white text-green-700 hover:bg-green-100'
              }`}
              onClick={() => setSelectedCrop(crop)}
            >
              {crop.name}
            </button>
          ))}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-full whitespace-nowrap bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
          >
            + Add Crop
          </button>
        </div>
      </div>

      {selectedCrop && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CropInfo selectedCrop={selectedCrop} />
          <WeatherAlerts weatherAlerts={weatherAlerts} />
          <WeatherForecast weatherForecast={weatherForecast} />
          <Tasks tasks={tasks} selectedCrop={selectedCrop} />
          <PestIssues pestIssues={pestIssues} />
          <Yields yields={yields} />
          <ResourceUsage resourceUsage={resourceUsage} />
        </div>
      )}

      <MarketPrices marketPrices={marketPrices} />

      <AddCropModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addCrop}
        newCrop={newCrop}
        handleInputChange={handleInputChange}
      />
    </div>
  );
};

export default CropDashboard;