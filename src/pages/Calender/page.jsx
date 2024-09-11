import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar as CalendarIcon, Plus, Link } from 'lucide-react';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const RentalCalendar = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Tractor Rented In',
      start: new Date(2024, 8, 5),
      end: new Date(2024, 8, 10),
      type: 'rented-in'
    },
    {
      id: 2,
      title: 'Harvester Rented Out',
      start: new Date(2024, 8, 15),
      end: new Date(2024, 8, 20),
      type: 'rented-out'
    },
  ]);

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
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rental Calendar</h1>
        <div className="space-x-2">
          {/* <button 
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Rental
          </button> */}
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
            <Link size={20} className="mr-2" />
            Connect Google Calendar
          </button>
        </div>
      </div>

     <div className='mt-24'> <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
      /></div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Add New Rental</h2>
            <form onSubmit={handleAddEvent}>
              <input
                type="text"
                placeholder="Rental Title"
                className="w-full p-2 mb-2 border rounded"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                required
              />
              <input
                type="date"
                className="w-full p-2 mb-2 border rounded"
                value={newEvent.start}
                onChange={(e) => setNewEvent({...newEvent, start: new Date(e.target.value)})}
                required
              />
              <input
                type="date"
                className="w-full p-2 mb-2 border rounded"
                value={newEvent.end}
                onChange={(e) => setNewEvent({...newEvent, end: new Date(e.target.value)})}
                required
              />
              <select
                className="w-full p-2 mb-4 border rounded"
                value={newEvent.type}
                onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
              >
                <option value="rented-in">Rented In</option>
                <option value="rented-out">Rented Out</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded"
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