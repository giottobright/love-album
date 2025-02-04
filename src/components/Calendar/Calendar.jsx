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

function Calendar({ selectedDate, setSelectedDate, isAddMode, setIsAddMode }) {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('calendar-events');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Состояния для формы добавления события (используются только в режиме добавления)
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [formDate, setFormDate] = useState(selectedDate || new Date());

  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  // Если выбранная дата изменилась и включён режим добавления, обновляем дату в форме
  useEffect(() => {
    if (isAddMode && selectedDate) {
      setFormDate(selectedDate);
    }
  }, [selectedDate, isAddMode]);

  const getDaysInMonth = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = eachDayOfInterval({ start, end });
    const startDay = getDay(start);
    const prefixDays = Array(startDay === 0 ? 6 : startDay - 1).fill(null);
    return [...prefixDays, ...days];
  };

  const getEventsForDay = (day) => {
    if (!day) return [];
    return events.filter(ev => isSameDay(new Date(ev.date), day));
  };

  const handleAddEvent = () => {
    if (!newEventTitle.trim()) return;
    const newEvent = {
      id: Date.now(),
      date: formDate.toISOString().split('T')[0],
      title: newEventTitle,
      description: newEventDescription
    };
    setEvents(prev => [...prev, newEvent]);
    setNewEventTitle("");
    setNewEventDescription("");
    // Выход из режима добавления после успешного добавления события
    setIsAddMode(false);
  };

  const handleDayClick = (day) => {
    if (!day) return;
    setSelectedDate(day);
    setIsAddMode(false); // Режим просмотра – добавление недоступно
    setNewEventTitle("");
    setNewEventDescription("");
    setTimeout(() => {
      const el = document.getElementById("day-details");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <>
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
              onClick={() => handleDayClick(day)}
            >
              {day && <div className="day-number">{format(day, 'd')}</div>}
              {day && getEventsForDay(day).length > 0 && (
                <div className="event-marker"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      {selectedDate && (
        <div id="day-details" className="day-details">
          <h3>События на {format(selectedDate, 'd MMMM yyyy', { locale: ru })}</h3>
          <div className="events-list-day">
            {getEventsForDay(selectedDate).length > 0 ? (
              getEventsForDay(selectedDate).map(event => (
                <div key={event.id} className="event-item-day">
                  <strong>{event.title}</strong>
                  {event.description && <p>{event.description}</p>}
                </div>
              ))
            ) : (
              <p className="no-events">ничего не запланировано</p>
            )}
          </div>
          {isAddMode && (
            <div className="event-form">
              <h4>Добавить событие</h4>
              <label>
                <input 
                  type="date" 
                  value={format(formDate, 'yyyy-MM-dd')} 
                  onChange={(e) => setFormDate(new Date(e.target.value))}
                />
              </label>
              <input 
                type="text" 
                placeholder="Название события" 
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
              />
              <textarea 
                placeholder="Описание события" 
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
              />
              <button onClick={handleAddEvent}>Добавить</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Calendar;