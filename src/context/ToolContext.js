import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
const ToolContext = createContext();

const routes = {
    addTool: `${process.env.REACT_APP_BACKEND_URL}/api/equipment/create`,
    getTools: `${process.env.REACT_APP_BACKEND_URL}/api/equipment/get`,
    getToolById: `${process.env.REACT_APP_BACKEND_URL}/api/equipment/getById`,
    deleteTool: `${process.env.REACT_APP_BACKEND_URL}/api/equipment/delete`,
    updateTool: `${process.env.REACT_APP_BACKEND_URL}/api/equipment/update`
}

export const ToolProvider = ({ children }) => {
  const [tools, setTools] = useState([]);

  const addTool = useCallback(async (formData) => {
    try {
      const response = await axios.post(routes.addTool, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTools(prevTools => [...prevTools, response.data]);
      toast.success('Tool added successfully');
      return response.data;
    } catch (error) {
      console.error('Error adding tool:', error);
      toast.error('Failed to add tool');
      throw error;
    }
  }, []);

  const getTools = useCallback(async () => {
    try {
      const response = await axios.get(routes.getTools, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTools(response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching tools:', error);
      toast.error('Failed to fetch tools');
      throw error;
    }
  }, []);

  const getToolById = useCallback(async (id) => {
    try {
      const response = await axios.get(`${routes.getToolById}/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Tool fetched successfully');
      return response.data;
    } catch (error) {
      console.error('Error fetching tool by id:', error);
      toast.error('Failed to fetch tool by id');
      throw error;
    }
  }, []);

  const deleteTool = useCallback(async (id) => {
    try {
      await axios.delete(`${routes.deleteTool}/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTools((prevTools) => prevTools.filter((tool) => tool.id !== id));
      toast.success('Tool deleted successfully');
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast.error('Failed to delete tool');
      throw error;
    }
  }, []);

  const updateTool = useCallback(async (id, updatedData) => {
    try {
      const response = await axios.put(`${routes.updateTool}/${id}`, updatedData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTools(prevTools => prevTools.map(tool => tool.id === id ? response.data : tool));
      toast.success('Tool updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating tool:', error);
      toast.error('Failed to update tool');
      throw error;
    }
  }, []);

  useEffect(() => {
    getTools();
  }, [getTools]);

  const value = {
    tools,
    addTool,
    getTools,
    getToolById,
    deleteTool,
    updateTool
  };

  return <ToolContext.Provider value={value}>{children}</ToolContext.Provider>;
};

export const useTool = () => {
  const context = useContext(ToolContext);
  if (!context) {
    throw new Error('useTool must be used within a ToolProvider');
  }
  return context;
};
