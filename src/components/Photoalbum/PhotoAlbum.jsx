// love-album/src/components/Photoalbum/PhotoAlbum.jsx
import React, { useState } from 'react';
import { format, eachMonthOfInterval, compareDesc } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Link, useParams } from 'react-router-dom';
import './PhotoAlbum.css';
import { api } from '../../utils/api';

function PhotoAlbum() {
  const { monthKey } = useParams();
  const [months, setMonths] = useState(() => {
    const saved = localStorage.getItem('photo-album');
    return saved ? JSON.parse(saved) : {};
  });

  const startDate = new Date('2024-03-22');
  const currentDate = new Date();
  const monthsArray = eachMonthOfInterval({
    start: startDate,
    end: currentDate,
  }).sort(compareDesc);

  // Состояния для модального окна добавления фото
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [modalData, setModalData] = useState({
    file: null,
    comment: '',
    day: '',
    location: '',
  });

  async function handleAddPhoto() {
    if (!selectedFolder) {
      alert('Выберите папку (месяц и год)');
      return;
    }
    if (!modalData.file) {
      alert('Выберите фото');
      return;
    }
    if (!modalData.day) {
      alert('Введите число (день)');
      return;
    }
  
    try {
      // Формируем полную дату
      const dayFormatted = modalData.day.toString().padStart(2, '0');
      const fullDate = `${selectedFolder}-${dayFormatted}`;
  
      const formData = new FormData();
      formData.append('photo', modalData.file);
      formData.append('comment', modalData.comment || '');
      formData.append('date', fullDate);
      formData.append('location', modalData.location || '');
      formData.append('monthKey', selectedFolder);
  
      const result = await api.uploadPhoto(formData);
      
      if (result.success) {
        const newPhoto = {
          url: result.photoUrl,
          comment: modalData.comment,
          date: fullDate,
          location: modalData.location,
        };
        const updatedMonths = { ...months };
        if (!updatedMonths[selectedFolder]) {
          updatedMonths[selectedFolder] = { photos: [] };
        }
        updatedMonths[selectedFolder].photos.push(newPhoto);
        setMonths(updatedMonths);
        localStorage.setItem('photo-album', JSON.stringify(updatedMonths));
        setShowAddModal(false);
        // Сброс формы
        setSelectedFolder('');
        setModalData({
          file: null,
          comment: '',
          day: '',
          location: '',
        });
      } else {
        throw new Error(result.error || 'Ошибка при загрузке фото');
      }
    } catch (error) {
      console.error('Ошибка при загрузке фото:', error);
      alert(`Ошибка при загрузке фото: ${error.message}`);
    }
  }



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
                    setModalData(prev => ({ ...prev, file: e.target.files[0] }));
                  }
                }}
              />
            </label>
            <label>
              Комментарий:
              <textarea
                value={modalData.comment}
                onChange={(e) => setModalData(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Комментарий к фото (необязательно)"
              />
            </label>
            <label>
              День:
              <input
                type="number"
                min="1"
                max="31"
                value={modalData.day}
                onChange={(e) => setModalData(prev => ({ ...prev, day: e.target.value }))}
                placeholder="Введите число"
              />
            </label>
            <label>
              Локация:
              <input
                type="text"
                value={modalData.location}
                onChange={(e) => setModalData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Локация фото"
              />
            </label>
            <div className="modal-actions">
              <button onClick={handleAddPhoto}>Добавить</button>
              <button onClick={() => setShowAddModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      <div className="months-grid">
        {monthsArray.map((month) => {
          const folder = format(month, 'yyyy-MM');
          const photosCount = months[folder]?.photos?.length || 0;
          const previewPhotos = months[folder]?.photos?.slice(0, 4) || [];

          return (
            <Link to={`/photoalbum/${folder}`} key={folder} className="month-card">
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