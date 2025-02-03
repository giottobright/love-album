import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  getDay,
  isToday,
  differenceInWeeks
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

  const startDate = new Date('2024-03-22');
  const currentDate = new Date();
  const weeksCount = differenceInWeeks(currentDate, startDate);

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

  const getEventsForDay = (day) => {
    if (!day) return [];
    return events.filter(ev => isSameDay(new Date(ev.date), day));
  };

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <div className="stats">
          <div className="weeks-counter">
            <span className="heart-icon">❤️</span>
            <span>Вместе {weeksCount} недель</span>
          </div>
          <div className="start-date">
            Начало истории:<br />
            {format(startDate, 'd MMMM yyyy', { locale: ru })}
          </div>
        </div>
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
        {getDaysInMonth(currentMonth).map((day, idx) => (
          <div
            key={day ? day.toString() : `empty-${idx}`}
            className={`day-cell ${!day ? 'empty' : ''} 
              ${day && isToday(day) ? 'today' : ''} 
              ${day && !isSameMonth(day, currentMonth) ? 'different-month' : ''}
              ${day && selectedDate && isSameDay(day, selectedDate) ? 'selected' : ''}`}
            onClick={() => day && setSelectedDate(day)}
          >
            {day && (
              <>
                <div className="day-number">{format(day, 'd')}</div>
                <div className="day-events">
                  {getEventsForDay(day).map(event => (
                    <div
                      key={event.id}
                      className="event-pill"
                      style={{ backgroundColor: event.color || '#4fc3f7' }}
                    >
                      {event.time} {event.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="event-form-overlay" onClick={() => setSelectedDate(null)}>
          <div className="event-form" onClick={e => e.stopPropagation()}>
            <h3>{format(selectedDate, 'd MMMM yyyy', { locale: ru })}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              addEvent({
                title: formData.get('title'),
                time: formData.get('time'),
                description: formData.get('description'),
                color: formData.get('color')
              });
            }}>
              <input type="text" name="title" placeholder="Название события" required />
              <input type="time" name="time" required />
              <textarea name="description" placeholder="Описание события..." rows="3" />
              <input type="color" name="color" defaultValue="#4fc3f7" />
              <div className="form-buttons">
                <button type="submit">Добавить</button>
                <button type="button" onClick={() => setSelectedDate(null)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;