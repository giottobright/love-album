import React, { useState } from 'react';
import './PhotoAlbum.css';

function PhotoAlbum() {
  const [months, setMonths] = useState([]);
  const startDate = new Date('2024-03-22');

  const addPhoto = (monthIndex, photo) => {
    setMonths(prevMonths => {
      const newMonths = [...prevMonths];
      if (!newMonths[monthIndex]) {
        newMonths[monthIndex] = { photos: [] };
      }
      newMonths[monthIndex].photos.push({
        url: URL.createObjectURL(photo),
        title: '',
        description: '',
        date: new Date()
      });
      return newMonths;
    });
  };

  const updatePhotoDetails = (monthIndex, photoIndex, details) => {
    setMonths(prevMonths => {
      const newMonths = [...prevMonths];
      newMonths[monthIndex].photos[photoIndex] = {
        ...newMonths[monthIndex].photos[photoIndex],
        ...details
      };
      return newMonths;
    });
  };

  return (
    <div className="photo-album">
      <h1>Наш Фотоальбом</h1>
      <div className="months-grid">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="month-card">
            <h2>{new Date(2024, i).toLocaleString('ru', { month: 'long' })}</h2>
            <div className="photos-grid">
              {months[i]?.photos.map((photo, photoIndex) => (
                <div key={photoIndex} className="photo-container">
                  <img src={photo.url} alt={photo.title} />
                  <input
                    type="text"
                    placeholder="Название"
                    value={photo.title}
                    onChange={(e) => updatePhotoDetails(i, photoIndex, { title: e.target.value })}
                  />
                  <textarea
                    placeholder="Описание"
                    value={photo.description}
                    onChange={(e) => updatePhotoDetails(i, photoIndex, { description: e.target.value })}
                  />
                </div>
              ))}
              <div className="add-photo">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => addPhoto(i, e.target.files[0])}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhotoAlbum;