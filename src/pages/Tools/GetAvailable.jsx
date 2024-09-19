import React, { useState, useEffect } from 'react';
import { Search, Sliders, Star, DollarSign, Edit, Trash2, X } from 'lucide-react';
import { useTool } from '../../context/ToolContext';
import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';

const ToolCard = ({ tool, currentUser, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
    <div className="relative">
      <img 
        src={tool.images && tool.images.length > 0 && tool.images[0]
          ? `${process.env.REACT_APP_BACKEND_URL}/${tool.images[0]}` 
          : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGY6b7YqSv02iiBVLEoVUx10301RnmFA1x3BLU61s-qnicrJSzIEmPHgPIGQxclEXbC2k&usqp=CAU'} 
        alt={tool.name} 
        className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105" 
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGY6b7YqSv02iiBVLEoVUx10301RnmFA1x3BLU61s-qnicrJSzIEmPHgPIGQxclEXbC2k&usqp=CAU';
        }}
      />
      <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 m-2 rounded-md text-sm font-semibold">
        ${tool.pricePerDay}/day
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-xl font-bold mb-2 text-gray-800">{tool.name}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tool.description}</p>
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-5 w-5 ${i < 3 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ))}
        <span className="ml-2 text-sm text-gray-600">(3 reviews)</span>
      </div>
      <div className="flex items-center justify-between">
        {currentUser && currentUser.id === tool.ownerId ? (
          <div className="flex space-x-2">
            <button onClick={() => onEdit(tool)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex items-center">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button onClick={() => onDelete(tool.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex items-center">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        ) : (
          <NavLink to={`/product/${tool.id}`} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-300 inline-flex items-center">
            Rent Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </NavLink>
        )}
      </div>
    </div>
  </div>
);

const EditModal = ({ tool, onClose, onSave }) => {
  const [editedTool, setEditedTool] = useState(tool);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTool(prev => ({ ...prev, [name]: name === 'pricePerDay' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedTool);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Tool</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={editedTool.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              value={editedTool.description}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pricePerDay">
              Price Per Day
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="pricePerDay"
              type="number"
              name="pricePerDay"
              value={editedTool.pricePerDay}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AvailableToolsListing = () => {
  const { getTools, deleteTool, updateTool } = useTool();
  const [tools, setTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterQuality, setFilterQuality] = useState(0);
  const { user } = useAuth();
  const [editingTool, setEditingTool] = useState(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const fetchedTools = await getTools();
        setTools(fetchedTools);
      } catch (error) {
        console.error('Error fetching tools:', error);
      }
    };
    fetchTools();
  }, [getTools]);

  const filteredAndSortedTools = tools
    .filter(tool => 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      tool.available
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'priceAsc') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'priceDesc') return b.pricePerDay - a.pricePerDay;
      return 0;
    });

  const handleEdit = (tool) => {
    setEditingTool(tool);
  };

  const handleDelete = async (toolId) => {
    try {
      await deleteTool(toolId);
      setTools(tools.filter(tool => tool.id !== toolId));
    } catch (error) {
      console.error('Error deleting tool:', error);
    }
  };

  const handleSaveEdit = async (editedTool) => {
    try {
      const updatedTool = await updateTool(editedTool.id, editedTool);
      setTools(tools.map(tool => tool.id === updatedTool.id ? updatedTool : tool));
      setEditingTool(null);
    } catch (error) {
      console.error('Error updating tool:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12 animate-fade-in">Discover Available Tools</h1>
        
        {/* Search and Filter Section */}
        <div className="mb-10 bg-white p-6 rounded-lg shadow-md animate-slide-in-top">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for tools..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition duration-150 ease-in-out"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-150 ease-in-out flex items-center animate-pulse">
                <Sliders className="mr-2 h-5 w-5" />
                Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedTools.map((tool, index) => (
            <div key={tool.id} className={`animate-fade-in-up`} style={{animationDelay: `${index * 0.1}s`}}>
              <ToolCard 
                tool={tool} 
                currentUser={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
        
        {/* No Results Message */}
        {filteredAndSortedTools.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <img src="/no-results.svg" alt="No results" className="mx-auto w-48 h-48 mb-6 animate-bounce" />
            <p className="text-xl text-gray-600">No tools found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Edit Modal */}
        {editingTool && (
          <div className="animate-fade-in">
            <EditModal
              tool={editingTool}
              onClose={() => setEditingTool(null)}
              onSave={handleSaveEdit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableToolsListing;