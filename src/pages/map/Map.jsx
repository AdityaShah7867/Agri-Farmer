import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '70vh'
};

const center = {
  lat: 19.4655, // Latitude for Virar, Mumbai
  lng: 72.7956  // Longitude for Virar, Mumbai
};

// Custom icons for different tool categories
const icons = {
  heavy: 'https://e7.pngegg.com/pngimages/887/788/png-clipart-john-deere-tractor-agriculture-tractor-car-agriculture.png',
  attachment: 'https://w1.pngwing.com/pngs/297/769/png-transparent-emoji-sticker-spanners-email-text-messaging-tool-hardware-wrench-hardware-accessory.png',
  handheld: 'https://www.pngfind.com/pngs/m/536-5363465_plough-agriculture-farming-png-image-plough-clipart-transparent.png',
  default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-92otGDh6GDE3F8Qp2entkhQprJVRa2Zc9w&s'
};

// Mock data for tools near Virar, Mumbai
const allTools = [
  { id: 1, name: 'Tractor', position: { lat: 19.4660, lng: 72.7970 }, price: 1000, category: 'heavy' },
  { id: 2, name: 'Plow', position: { lat: 19.4640, lng: 72.7940 }, price: 500, category: 'attachment' },
  { id: 3, name: 'Harvester', position: { lat: 19.4670, lng: 72.7930 }, price: 1500, category: 'heavy' },
  { id: 4, name: 'Seeder', position: { lat: 19.4630, lng: 72.7960 }, price: 750, category: 'attachment' },
  { id: 5, name: 'Sprayer', position: { lat: 19.4650, lng: 72.7980 }, price: 600, category: 'handheld' },
];

const Map = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_MAPS_API_LOL}`
  });

  const [map, setMap] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [filteredTools, setFilteredTools] = useState(allTools);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    allTools.forEach(tool => bounds.extend(tool.position));
    map.fitBounds(bounds);
    setMap(map);
  }, []);

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
  }, [filterCategory, filterPrice]);

  return isLoaded ? (
    <div className="relative h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 p-4 bg-white shadow-md z-10 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Available Tools in Virar</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="heavy">Heavy Machinery</option>
            <option value="attachment">Attachments</option>
            <option value="handheld">Handheld Tools</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Price Range (₹/day)</label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            value={filterPrice}
            onChange={(e) => setFilterPrice(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="under500">Under ₹500</option>
            <option value="500to1000">₹500 - ₹1000</option>
            <option value="over1000">Over ₹1000</option>
          </select>
        </div>
        <ul className="space-y-2">
          {filteredTools.map((tool) => (
            <li key={tool.id} className="p-2 hover:bg-gray-100 rounded flex items-center">
              <img src={icons[tool.category] || icons.default} alt={tool.category} className="w-6 h-6 mr-2" />
              <button 
                onClick={() => {
                  setSelectedTool(tool);
                  map.panTo(tool.position);
                }}
                className="text-left flex-grow"
              >
                <span className="font-medium">{tool.name}</span>
                <span className="block text-sm text-gray-500">₹{tool.price}/day</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full md:w-3/4 h-full">
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
                scaledSize: new window.google.maps.Size(30, 30)
              }}
            />
          ))}

          {selectedTool && (
            <InfoWindow
              position={selectedTool.position}
              onCloseClick={() => setSelectedTool(null)}
            >
              <div>
                <h3 className="font-bold text-lg">{selectedTool.name}</h3>
                <p className="text-gray-600">{selectedTool.category}</p>
                <p className="font-medium">₹{selectedTool.price}/day</p>
                <button className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm transition duration-300">Rent Now</button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  ) : <div>Loading...</div>;
};

export default Map;