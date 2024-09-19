import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar as CalendarIcon, Plus, Link, X } from 'lucide-react';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const url = `${process.env.REACT_APP_BACKEND_URL}/api/rental/getCalenderRentalsOUT`;
const urlIN = `${process.env.REACT_APP_BACKEND_URL}/api/rental/getCalenderRentalsIN`;

const RentalCalendar = () => {
  const [events, setEvents] = useState([]);

  const getCalenderRentalsOut = async () => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const formattedEvents = response.data.map(rental => ({
        id: rental.id,
        title: `${rental.equipment.name} Rented Out`,
        start: new Date(rental.startDate),
        end: new Date(rental.endDate),
        type: 'rented-out',
        equipment: rental.equipment,
        renter: rental.equipment.owner
      }));
      setEvents(prevEvents => [...prevEvents, ...formattedEvents]);
    } catch (error) {
      console.error('Error fetching rented out events:', error);
    }
  };

  const getCalenderRentalsIn = async () => {
    try {
      const response = await axios.get(urlIN, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const formattedEvents = response.data.map(rental => ({
        id: rental.id,
        title: `${rental.equipment.name} Rented In`,
        start: new Date(rental.startDate),
        end: new Date(rental.endDate),
        type: 'rented-in',
        equipment: rental.equipment,
        renter: rental.equipment.owner
      }));
      setEvents(prevEvents => [...prevEvents, ...formattedEvents]);
    } catch (error) {
      console.error('Error fetching rented in events:', error);
    }
  };

  useEffect(() => {
    getCalenderRentalsOut();
    getCalenderRentalsIn();
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    type: 'rented-in'
  });

  const handleAddEvent = (e) => {
    e.preventDefault();
    const updatedEvents = [...events, { ...newEvent, id: events.length + 1 }];
    setEvents(updatedEvents);
    setShowAddModal(false);
    setNewEvent({ title: '', start: '', end: '', type: 'rented-in' });
  };

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: event.type === 'rented-in' ? '#93c5fd' : '#86efac',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'black',
      border: '0px',
      display: 'block'
    };
    return { style };
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Rental Calendar</h1>
        <div className="space-x-4">
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center transition duration-300"
          >
            <Plus size={20} className="mr-2" />
            Add Rental
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          className="font-sans"
        />
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add New Rental</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Rental Title</label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter rental title"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  id="start"
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newEvent.start}
                  onChange={(e) => setNewEvent({...newEvent, start: new Date(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  id="end"
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newEvent.end}
                  onChange={(e) => setNewEvent({...newEvent, end: new Date(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Rental Type</label>
                <select
                  id="type"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                >
                  <option value="rented-in">Rented In</option>
                  <option value="rented-out">Rented Out</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalCalendar;