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
        <h1>Наш Фотоальбом</h1>
      </header>

      {/* Панель добавления фото */}
      <div className="add-photo-header">
        <button className="add-photo-button" onClick={() => setShowAddModal(true)}>
          <span>Добавить фото</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" 
               xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14M5 12h14" stroke="#8B5CF6" strokeWidth="2" 
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

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