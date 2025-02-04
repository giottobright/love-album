import React, { useEffect, useState } from 'react';
import { format, differenceInWeeks } from 'date-fns';
import { ru } from 'date-fns/locale';
import Calendar from '../Calendar/Calendar';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import './Home.css';

function Home() {
  const coupleName = "Дима и Таня";
  const startDate = new Date("2024-03-22");
  const now = new Date();
  const weeksTogether = differenceInWeeks(now, startDate);

  const [upcomingEvents, setUpcomingEvents] = useState([]);

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
  }, []);

  // Состояния для выбранной даты и режима добавления события
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const handleAddEventClick = () => {
    setSelectedDate(new Date());
    setIsAddMode(true);
    // Прокручиваем к форме добавления
    setTimeout(() => {
      const el = document.getElementById("day-details");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="home-container">
      <div className="couple-card">
        <div className="couple-icon">
          <PeopleIcon />
        </div>
        <div className="couple-info">
          <h1>{coupleName}</h1>
          <p>Вместе {weeksTogether} недель</p>
        </div>
      </div>

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
              <li key={event.id} className="event-item">
                <span>{event.title}</span>
                <span> {format(new Date(event.date), 'd MMMM', { locale: ru })}</span>
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
        />
      </div>
    </div>
  );
}

export default Home;