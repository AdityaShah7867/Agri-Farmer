import React, { useState, useEffect } from 'react';
import { Search, Sliders, Star, DollarSign, Edit, Trash2, X } from 'lucide-react';
import { useTool } from '../../context/ToolContext';
import { useAuth } from '../../context/AuthContext';

const ToolCard = ({ tool, currentUser, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <img src={`${process.env.REACT_APP_BACKEND_URL}/${tool.images[0]}`} alt={tool.name} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
      <p className="text-gray-600 text-sm mb-2">{tool.description}</p>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-5 w-5 ${i < 3 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-green-600 font-semibold flex items-center">
          <DollarSign className="h-4 w-4 mr-1" />
          {tool.pricePerDay}/day
        </span>
        {currentUser && currentUser.id === tool.ownerId ? (
          <div className="flex space-x-2">
            <button onClick={() => onEdit(tool)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
            <button onClick={() => onDelete(tool.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm flex items-center">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        ) : (
          <a href={`/product/${tool.id}`} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm">
            Rent Now
          </a>
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
            </select>
          </div>
        </div>
        
        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTools.map(tool => (
            <ToolCard 
              key={tool.id} 
              tool={tool} 
              currentUser={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
        
        {/* No Results Message */}
        {filteredAndSortedTools.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No tools found matching your criteria.</p>
        )}

        {/* Edit Modal */}
        {editingTool && (
          <EditModal
            tool={editingTool}
            onClose={() => setEditingTool(null)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </div>
  );
};

export default AvailableToolsListing;