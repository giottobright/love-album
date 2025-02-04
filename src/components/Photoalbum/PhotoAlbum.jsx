import React, { useState } from 'react';
import { format, eachMonthOfInterval, compareDesc } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Link } from 'react-router-dom';
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

  // Состояния для модального окна добавления фото
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedComment, setSelectedComment] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleModalSubmit = () => {
    if (!selectedFolder || !selectedFile) {
      alert('Выберите папку и фото');
      return;
    }
    const newPhoto = { 
      url: URL.createObjectURL(selectedFile),
      comment: selectedComment, // комментарий к фото
      date: selectedDate,
      location: selectedLocation
    };
    const updatedMonths = { ...months };
    if (!updatedMonths[selectedFolder]) {
      updatedMonths[selectedFolder] = { photos: [] };
    }
    updatedMonths[selectedFolder].photos.push(newPhoto);
    setMonths(updatedMonths);
    localStorage.setItem('photo-album', JSON.stringify(updatedMonths));
    setShowAddModal(false);
    setSelectedFile(null);
    setSelectedFolder('');
    setSelectedComment('');
    setSelectedDate('');
    setSelectedLocation('');
  };

  return (
    <div className="photo-album-container">
      <header className="album-header">
        <div className="album-header-content">
          <div className="album-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h2>Наш фотоальбом</h2>
          <button className="add-event-button" onClick={() => setShowAddModal(true)}>
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </header>



      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Добавить фото</h2>
            <label>
              Выберите папку (месяц и год):
              <select value={selectedFolder} onChange={(e) => setSelectedFolder(e.target.value)}>
                <option value="">--Выберите папку--</option>
                {monthsArray.map((month) => {
                  const folder = format(month, 'yyyy-MM');
                  return (
                    <option key={folder} value={folder}>
                      {format(month, 'LLLL yyyy', { locale: ru })}
                    </option>
                  );
                })}
              </select>
            </label>
            <label>
              Выберите фото:
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
            </label>
            <label>
              Комментарий:
              <textarea 
                value={selectedComment} 
                onChange={(e) => setSelectedComment(e.target.value)}
                placeholder="Напишите комментарий к фото (необязательно)"
              />
            </label>
            <label>
              Дата:
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </label>
            <label>
              Локация:
              <input
                type="text"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                placeholder="Локация фото"
              />
            </label>
            <div className="modal-actions">
              <button onClick={handleModalSubmit}>Добавить</button>
              <button onClick={() => setShowAddModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      <div className="months-grid">
        {monthsArray.map((month) => {
          const monthKey = format(month, 'yyyy-MM');
          const photosCount = months[monthKey]?.photos?.length || 0;
          const previewPhotos = months[monthKey]?.photos?.slice(0, 4) || [];
          
          return (
            <Link to={`/photoalbum/${monthKey}`} key={monthKey} className="month-card">
              <div className="preview-grid">
                {previewPhotos.map((photo, idx) => (
                  <div key={idx} className="preview-photo">
                    <img src={photo.url} alt="" />
                  </div>
                ))}
              </div>
              <div className="month-info">
                <h2>{format(month, 'LLLL yyyy', { locale: ru })}</h2>
                <span>{photosCount} moments</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default PhotoAlbum;