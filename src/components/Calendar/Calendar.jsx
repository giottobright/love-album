import React, { useState } from 'react';
import { format, differenceInWeeks } from 'date-fns';
import { ru } from 'date-fns/locale';
import './Calendar.css';

function Calendar() {
  const [events, setEvents] = useState([]);
  const startDate = new Date('2024-03-22');
  const currentDate = new Date();
  const weeksCount = differenceInWeeks(currentDate, startDate);

  const addEvent = (event) => {
    setEvents(prev => [...prev, {
      ...event,
      id: Date.now()
    }]);
  };

  const addPhotoToEvent = (eventId, photo) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, photo: URL.createObjectURL(photo) }
        : event
    ));
  };

  return (
    <div className="calendar">
      <h1>Наш Календарь</h1>
      <div className="weeks-counter">
        Мы вместе уже {weeksCount} недель! ❤️
      </div>
      
      <div className="add-event-form">
        <h3>Добавить новое событие</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          addEvent({
            title: formData.get('title'),
            date: formData.get('date'),
            time: formData.get('time'),
            description: formData.get('description')
          });
          e.target.reset();
        }}>
          <div className="form-group">
            <label>Название события</label>
            <input 
              type="text" 
              name="title" 
              placeholder="Например: Романтический ужин" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Дата</label>
            <input 
              type="date" 
              name="date" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Время</label>
            <input 
              type="time" 
              name="time" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Описание</label>
            <textarea 
              name="description" 
              placeholder="Добавьте описание события..." 
              rows="4"
            />
          </div>
          
          <button type="submit" className="submit-button">
            Добавить событие
          </button>
        </form>
      </div>

      <div className="events-list">
        {events
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map(event => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h3>{event.title}</h3>
                <span className="event-date">
                  {format(new Date(event.date), 'dd MMMM yyyy', { locale: ru })} в {event.time}
                </span>
              </div>
              
              <div className="event-description">
                <p>{event.description}</p>
              </div>
              
              <div className="event-photo">
                {event.photo ? (
                  <img src={event.photo} alt={event.title} />
                ) : (
                  <div className="photo-upload">
                    <label className="photo-upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => addPhotoToEvent(event.id, e.target.files[0])}
                        className="photo-input"
                      />
                      <span>Добавить фото</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Calendar;