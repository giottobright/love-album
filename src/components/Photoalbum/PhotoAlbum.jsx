import React, { useState, useEffect } from 'react';
import { format, eachMonthOfInterval, compareDesc } from 'date-fns';
import { ru } from 'date-fns/locale';
import './PhotoAlbum.css';

function PhotoAlbum() {
  const [months, setMonths] = useState(() => {
    const saved = localStorage.getItem('photo-album');
    return saved ? JSON.parse(saved) : {};
  });

  const startDate = new Date('2024-03-22');
  const currentDate = new Date();

  const monthsArray = eachMonthOfInterval({
    start: startDate,
    end: currentDate
  }).sort(compareDesc);

  useEffect(() => {
    localStorage.setItem('photo-album', JSON.stringify(months));
  }, [months]);

  const addPhoto = (monthIndex, photo) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setMonths(prev => {
        const newMonths = { ...prev };
        const monthKey = format(monthsArray[monthIndex], 'yyyy-MM');
        if (!newMonths[monthKey]) {
          newMonths[monthKey] = { photos: [] };
        }
        newMonths[monthKey].photos.push({
          url: reader.result,
          title: '',
          description: '',
          date: new Date().toISOString()
        });
        return newMonths;
      });
    };
    reader.readAsDataURL(photo);
  };

  const updatePhotoDetails = (monthKey, photoIndex, details) => {
    setMonths(prev => {
      const newMonths = { ...prev };
      if (newMonths[monthKey]?.photos[photoIndex]) {
        newMonths[monthKey].photos[photoIndex] = {
          ...newMonths[monthKey].photos[photoIndex],
          ...details
        };
      }
      return newMonths;
    });
  };

  return (
    <div className="photo-album-container">
      <header className="album-header">
        <h1>Наш Фотоальбом</h1>
        <div className="current-date">
          {format(currentDate, 'd MMMM yyyy', { locale: ru })}
        </div>
      </header>
      <div className="months-grid">
        {monthsArray.map((month, index) => {
          const monthKey = format(month, 'yyyy-MM');
          return (
            <div key={monthKey} className="month-card">
              <div className="month-header">
                <h2>{format(month, 'LLLL yyyy', { locale: ru })}</h2>
                <div className="photo-counter">
                  {months[monthKey]?.photos?.length || 0} фото
                </div>
              </div>
              <div className="photos-grid">
                {months[monthKey]?.photos?.map((photo, idx) => (
                  <div key={idx} className="photo-container">
                    <div className="photo-wrapper">
                      <img src={photo.url} alt={photo.title} />
                      <div className="photo-overlay">
                        <input
                          type="text"
                          className="photo-title-input"
                          placeholder="Название"
                          value={photo.title}
                          onChange={(e) =>
                            updatePhotoDetails(monthKey, idx, { title: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          className="photo-description-input"
                          placeholder="Описание"
                          value={photo.description}
                          onChange={(e) =>
                            updatePhotoDetails(monthKey, idx, { description: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="add-photo">
                  <label className="add-photo-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          addPhoto(index, e.target.files[0]);
                        }
                      }}
                      className="photo-input"
                    />
                    <span className="add-photo-text">
                      <span className="add-icon">+</span> Добавить фото
                    </span>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PhotoAlbum;