import React, { useEffect, useState } from 'react';
import { format, differenceInWeeks } from 'date-fns';
import { ru } from 'date-fns/locale';
import Calendar from '../Calendar/Calendar';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import EventModal from '../EventModal/EventModal';
import './Home.css';
import ServerStatus from '../ServerStatus/ServerStatus';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

function Home() {
  const coupleName = "Дима и Таня";
  const startDate = new Date("2024-03-22");
  const now = new Date();
  const weeksTogether = differenceInWeeks(now, startDate);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [modalEvent, setModalEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  // Дополнительное состояние для обновления Calendar после изменения событий
  const [calendarRefresh, setCalendarRefresh] = useState(Date.now());
  const { setAuth } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('calendar-events');
    if (saved) {
      const events = JSON.parse(saved);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcoming = events.filter(event => new Date(event.date) >= today);
      upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
      setUpcomingEvents(upcoming);
    }
  }, [calendarRefresh]);

  const handleTestLogin = async () => {
    try {
        const response = await api.testLogin();
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('accountId', response.accountId);
        
        // Обновить состояние авторизации
        setAuth({ 
            token: response.token, 
            accountId: response.accountId 
        });
    } catch (error) {
        console.error('Test login failed:', error);
    }
};

  const handleAddEventClick = () => {
    setSelectedDate(new Date());
    setIsAddMode(true);
    setTimeout(() => {
      const el = document.getElementById("day-details");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleEventClick = (event) => {
    setModalEvent(event);
  };

  const handleDeleteEvent = (eventId) => {
    const saved = localStorage.getItem('calendar-events');
    if (saved) {
      const events = JSON.parse(saved).filter(e => e.id !== eventId);
      localStorage.setItem('calendar-events', JSON.stringify(events));
    }
    setModalEvent(null);
    // Обновляем календарь
    setCalendarRefresh(Date.now());
  };

  const handleSaveEvent = (updatedEvent) => {
    const saved = localStorage.getItem('calendar-events');
    if (saved) {
      const events = JSON.parse(saved).map(e => e.id === updatedEvent.id ? updatedEvent : e);
      localStorage.setItem('calendar-events', JSON.stringify(events));
    }
    setModalEvent(null);
    // Обновляем календарь
    setCalendarRefresh(Date.now());
  };

  return (
    <div className="home-container">
      <div className="couple-card">
        <div className="couple-icon">
          <PeopleIcon />
        </div>
        <div className="couple-info">
          <h1>{coupleName}</h1>
          <ServerStatus/>
          <p>Вместе {weeksTogether} недель</p>
        </div>
      </div>

      {process.env.NODE_ENV !== 'production' && (
                <button 
                    className="test-login-button"
                    onClick={handleTestLogin}
                >
                    Test Login
                </button>
            )}

      <div className="events-card">
        <div className="events-header">
          <CalendarTodayIcon className="calendar-icon" />
          <h2>Ближайшие события</h2>
          <button className="add-event-button" onClick={handleAddEventClick}>
            <AddIcon />
          </button>
        </div>
        {upcomingEvents.length > 0 ? (
          <ul className="events-list">
            {upcomingEvents.map(event => (
              <li key={event.id} className="event-item" onClick={() => handleEventClick(event)}>
                <span>{event.title}</span>
                <span>{format(new Date(event.date), 'd MMMM', { locale: ru })}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-events">Нет запланированных событий</p>
        )}
      </div>

      <div className="calendar-wrapper">
        <Calendar 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate} 
          isAddMode={isAddMode} 
          setIsAddMode={setIsAddMode}
          onEventClick={handleEventClick}
          calendarRefresh={calendarRefresh}
        />
      </div>

      {modalEvent && (
        <EventModal 
          event={modalEvent}
          onClose={() => setModalEvent(null)}
          onDelete={handleDeleteEvent}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
}

export default Home;