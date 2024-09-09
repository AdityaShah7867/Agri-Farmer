import React, { useState } from 'react';
import { Search, Sliders, Star, DollarSign } from 'lucide-react';

// Mock data for tools
const mockTools = [
  { id: 1, name: 'Tractor', description: 'Heavy-duty farm tractor', image: 'https://images.tractorgyan.com/uploads/26531/62b065fb12dfd_Standard-460-4WD-tractorgyan.webp', quality: 4, pricePerDay: 100 },
  { id: 2, name: 'Plow', description: 'Attachable plow for field preparation', image: 'https://cdn.britannica.com/45/102545-050-EC6D12BD/tractor-disk-plow.jpg', quality: 3, pricePerDay: 50 },
  { id: 3, name: 'Seeder', description: 'Precision seeder for various crops', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/National_Agro_Happy_Seeder.jpg', quality: 5, pricePerDay: 75 },
  { id: 4, name: 'Harvester', description: 'Efficient crop harvester', image: 'https://m.media-amazon.com/images/I/71VjSuCezhL._AC_UF1000,1000_QL80_.jpg', quality: 4, pricePerDay: 150 },
  { id: 5, name: 'Irrigation System', description: 'Portable irrigation system', image: 'https://cdn.britannica.com/88/192788-050-89372081/irrigation-equipment-crops-field.jpg', quality: 3, pricePerDay: 80 },
  { id: 6, name: 'Sprayer', description: 'Chemical sprayer for pest control', image: 'https://www.rdsmme.com/wp-content/uploads/2022/03/AgricturalSprayer-scaled.jpg', quality: 4, pricePerDay: 60 },
  // Add more mock tools as needed
];

const ToolCard = ({ tool }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <img src={tool.image} alt={tool.name} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
      <p className="text-gray-600 text-sm mb-2">{tool.description}</p>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-5 w-5 ${i < tool.quality ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-green-600 font-semibold flex items-center">
          <DollarSign className="h-4 w-4 mr-1" />
          {tool.pricePerDay}/day
        </span>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm">
          Rent Now
        </button>
      </div>
    </div>
  </div>
);

const AvailableToolsListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterQuality, setFilterQuality] = useState(0);

  const filteredAndSortedTools = mockTools
    .filter(tool => 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      tool.quality >= filterQuality
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'priceAsc') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'priceDesc') return b.pricePerDay - a.pricePerDay;
      if (sortBy === 'quality') return b.quality - a.quality;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Available Tools for Rent</h1>
        
        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tools..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              className="border rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="quality">Highest Quality</option>
            </select>
            <div className="flex items-center space-x-2">
              <Sliders className="h-5 w-5 text-gray-600" />
              <select
                className="border rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                value={filterQuality}
                onChange={(e) => setFilterQuality(Number(e.target.value))}
              >
                <option value={0}>All Qualities</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
        
        {/* No Results Message */}
        {filteredAndSortedTools.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No tools found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default AvailableToolsListing;