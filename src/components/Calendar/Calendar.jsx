import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  getDay
} from 'date-fns';
import { ru } from 'date-fns/locale';
import './Calendar.css';

function Calendar() {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('calendar-events');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Удалена переменная weeksCount, так как она не используется
  // const weeksCount = differenceInWeeks(currentDate, startDate);

  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = eachDayOfInterval({ start, end });
    const startDay = getDay(start);
    const prefixDays = Array(startDay === 0 ? 6 : startDay - 1).fill(null);
    return [...prefixDays, ...days];
  };

  // Удалена функция добавления события addEvent, так как она не используется
  /*
  const addEvent = (event) => {
    setEvents(prev => [
      ...prev,
      {
        ...event,
        id: Date.now(),
        date: selectedDate.toISOString().split('T')[0]
      }
    ]);
    setSelectedDate(null);
  };
  */

  const getEventsForDay = (day) => {
    if (!day) return [];
    return events.filter(ev => isSameDay(new Date(ev.date), day));
  };

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <div className="navigation">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>←</button>
          <h2>{format(currentMonth, 'LLLL yyyy', { locale: ru })}</h2>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>→</button>
        </div>
      </header>
      <div className="weekdays">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      <div className="days">
        {getDaysInMonth(currentMonth).map((day, index) => (
          <div 
            key={index} 
            className={`day-cell ${!day ? 'empty' : ''} ${day && isSameDay(day, new Date()) ? 'today' : ''}`}
            onClick={() => day && setSelectedDate(day)}
          >
            {day && <div className="day-number">{format(day, 'd')}</div>}
            {day && getEventsForDay(day).map(event => (
              <div key={event.id} className="event-pill">{event.title}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;