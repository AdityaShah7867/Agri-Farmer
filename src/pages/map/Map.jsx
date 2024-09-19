import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useTool } from '../../context/ToolContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 19.4528376,
  lng: 19.4528376
};

const icons = {
  heavy: 'https://e7.pngegg.com/pngimages/887/788/png-clipart-john-deere-tractor-agriculture-tractor-car-agriculture.png',
  attachment: 'https://w1.pngwing.com/pngs/297/769/png-transparent-emoji-sticker-spanners-email-text-messaging-tool-hardware-wrench-hardware-accessory.png',
  handheld: 'https://www.pngfind.com/pngs/m/536-5363465_plough-agriculture-farming-png-image-plough-clipart-transparent.png',
  default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-92otGDh6GDE3F8Qp2entkhQprJVRa2Zc9w&s'
};

const modifyToolData = (tools) => {
  return tools.map(tool => ({
    id: tool.id,
    name: tool.name,
    position: { lat: tool.owner.latitude, lng: tool.owner.longitude },
    price: tool.pricePerDay,
    category: getCategoryFromName(tool.name),
    description: tool.description,
    available: tool.available,
    quantity: tool.quantity,
    images: tool.images,
    owner: {
      name: tool.owner.name,
      email: tool.owner.email,
      phone: tool.owner.phone
    }
  }));
};

const getCategoryFromName = (name) => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('tractor') || lowercaseName.includes('harvester')) return 'heavy';
  if (lowercaseName.includes('plough') || lowercaseName.includes('seeder')) return 'attachment';
  if (lowercaseName.includes('spade') || lowercaseName.includes('hoe')) return 'handheld';
  return 'default';
};

const Map = () => {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_MAPS_API_LOL}`
  });

  const { user } = useAuth();

useEffect(() => {
  console.log(user);
}, [user]);

  const { tools } = useTool();
  const [allTools, setAllTools] = useState([]);
  const [map, setMap] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [filteredTools, setFilteredTools] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');

  useEffect(() => {
    if (tools.length > 0) {
      const modifiedTools = modifyToolData(tools);
      setAllTools(modifiedTools);
      if (user) {
     
        const userTools = modifiedTools.filter(tool => tool.owner.id === user.id);
        setFilteredTools(userTools);
      
      } else {
        setFilteredTools(modifiedTools);
      }
    }
  }, [tools, user]);

  const onLoad = useCallback(function callback(map) {
    if (allTools.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      allTools.forEach(tool => bounds.extend(tool.position));
      map.fitBounds(bounds);
    }
    setMap(map);
  }, [allTools]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    let filtered = allTools;
    if (filterCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === filterCategory);
    }
    if (filterPrice !== 'all') {
      filtered = filtered.filter(tool => {
        if (filterPrice === 'under500') return tool.price < 500;
        if (filterPrice === '500to1000') return tool.price >= 500 && tool.price <= 1000;
        if (filterPrice === 'over1000') return tool.price > 1000;
        return true;
      });
    }
    setFilteredTools(filtered);
  }, [filterCategory, filterPrice, allTools]);

  useEffect(() => {
    console.log('filteredTools', filteredTools);
  }, [filteredTools]);

  return isLoaded ? (
    <div className="relative h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 lg:w-1/4 p-6 bg-white shadow-lg z-10 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-green-700">Available Tools in Virar</h2>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="heavy">Heavy Machinery</option>
            <option value="attachment">Attachments</option>
            <option value="handheld">Handheld Tools</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range (₹/day)</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            value={filterPrice}
            onChange={(e) => setFilterPrice(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="under500">Under ₹500</option>
            <option value="500to1000">₹500 - ₹1000</option>
            <option value="over1000">Over ₹1000</option>
          </select>
        </div>
        <ul className="space-y-4">
          {filteredTools.filter(tool => tool.owner.email !== user.email).map((tool) => (
            <li key={tool.id} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200 flex items-center">
              <img src={icons[tool.category] || icons.default} alt={tool.category} className="w-10 h-10 mr-4" />
              <button 
                onClick={() => {
                  setSelectedTool(tool);
                  map.panTo(tool.position);
                }}
                className="text-left flex-grow"
              >
                <span className="font-semibold text-lg block">{tool.name}</span>
                <span className="text-green-600 font-medium">₹{tool.price}/day</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full md:w-2/3 lg:w-3/4 h-full">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {filteredTools.map((tool) => (
            <Marker
              key={tool.id}
              position={tool.position}
              onClick={() => setSelectedTool(tool)}
              icon={{
                url: icons[tool.category] || icons.default,
                scaledSize: new window.google.maps.Size(40, 40)
              }}
            />
          ))}

          {selectedTool && (
            <InfoWindow
              position={selectedTool.position}
              onCloseClick={() => setSelectedTool(null)}
            >
              <div className="bg-white p-4 rounded-lg shadow-md max-w-sm">
                <h3 className="font-bold text-xl mb-2 text-green-700">{selectedTool.name}</h3>
                <p className="text-gray-600 mb-2 capitalize">{selectedTool.category}</p>
                <p className="text-sm mb-3">{selectedTool.description}</p>
                <p className="font-semibold text-lg mb-2 text-green-600">₹{selectedTool.price}/day</p>
                <p className="text-sm mb-1">Quantity: {selectedTool.quantity}</p>
                <p className="text-sm mb-1">Owner: {selectedTool.owner.name}</p>
                <p className="text-sm mb-3">Contact: {selectedTool.owner.phone}</p>
                {selectedTool.available ? (
                  <button onClick={
                    () => {
                      navigate(`/product/${selectedTool.id}`)
                    }
                  } className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300">Rent Now</button>
                ) : (
                  <p className="text-red-500 font-semibold text-center">Currently Unavailable</p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  ) : <div className="flex justify-center items-center h-screen text-2xl font-bold text-gray-600">Loading...</div>;
};

export default Map;