// love-album/src/components/MonthPhotos/MonthPhotos.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import './MonthPhotos.css';

function MonthPhotos() {
  const { monthKey } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);

  // Состояния для редактирования данных фото (описание, дата, локация)
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingComment, setEditingComment] = useState('');
  const [editingDate, setEditingDate] = useState('');
  const [editingLocation, setEditingLocation] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('photo-album');
    if (saved) {
      const data = JSON.parse(saved);
      setPhotos(data[monthKey]?.photos || []);
    }
  }, [monthKey]);

  const monthDate = parse(monthKey, 'yyyy-MM', new Date());

  // Состояния для модального окна добавления фото
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedComment, setSelectedComment] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleModalSubmit = () => {
    if (!selectedFile) {
      alert('Выберите фото');
      return;
    }
    const newPhoto = {
      url: URL.createObjectURL(selectedFile),
      comment: selectedComment,
      date: selectedDate,
      location: selectedLocation
    };
    const saved = localStorage.getItem('photo-album');
    let data = saved ? JSON.parse(saved) : {};
    if (!data[monthKey]) {
      data[monthKey] = { photos: [] };
    }
    data[monthKey].photos.push(newPhoto);
    localStorage.setItem('photo-album', JSON.stringify(data));
    setPhotos([...photos, newPhoto]);
    setShowAddModal(false);
    setSelectedFile(null);
    setSelectedComment('');
    setSelectedDate('');
    setSelectedLocation('');
  };

  // Запуск редактирования данных фото
  const startEditing = (index, photo) => {
    setEditingIndex(index);
    setEditingComment(photo.comment || '');
    setEditingDate(photo.date || '');
    setEditingLocation(photo.location || '');
  };

  // Сохранение новых данных для выбранного фото
  const saveEditedCaption = (index) => {
    const newPhotos = [...photos];
    newPhotos[index].comment = editingComment;
    newPhotos[index].date = editingDate;
    newPhotos[index].location = editingLocation;
    setPhotos(newPhotos);
    const saved = localStorage.getItem('photo-album');
    let data = saved ? JSON.parse(saved) : {};
    data[monthKey] = { photos: newPhotos };
    localStorage.setItem('photo-album', JSON.stringify(data));
    setEditingIndex(null);
    setEditingComment('');
    setEditingDate('');
    setEditingLocation('');
  };

  return (
    <div className="month-photos-container">
      <header className="month-header">
        <button onClick={() => navigate('/photoalbum')} className="back-button">
          ←
        </button>
        <h1>{format(monthDate, 'LLLL yyyy', { locale: ru })}</h1>
      </header>

      {/* Панель добавления фото */}
      <div className="add-photo-header">
        <button className="add-photo-button" onClick={() => setShowAddModal(true)}>
          <span>Добавить фото</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14M5 12h14" stroke="#8B5CF6" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Добавить фото</h2>
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
              Описание:
              <textarea
                value={selectedComment}
                onChange={(e) => setSelectedComment(e.target.value)}
                placeholder="Комментарий к фото (необязательно)"
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

      {/* Лента фото */}
      <div className="photos-feed">
        {photos.map((photo, index) => (
          <div key={index} className="photo-item">
            <img src={photo.url} alt="Фото" />
            {editingIndex === index ? (
              <div className="photo-caption editing">
                <input
                  type="text"
                  value={editingComment}
                  onChange={(e) => setEditingComment(e.target.value)}
                  placeholder="Введите описание"
                />
                <input
                  type="date"
                  value={editingDate}
                  onChange={(e) => setEditingDate(e.target.value)}
                  placeholder="Дата"
                />
                <input
                  type="text"
                  value={editingLocation}
                  onChange={(e) => setEditingLocation(e.target.value)}
                  placeholder="Локация"
                />
                <button onClick={() => saveEditedCaption(index)}>Сохранить</button>
              </div>
            ) : (
              <div className="photo-caption">
                {photo.comment || photo.date || photo.location ? (
                  <div className="photo-details">
                    {photo.comment && <div className="photo-comment">{photo.comment}</div>}
                    {photo.date && <div className="photo-date">Дата: {photo.date}</div>}
                    {photo.location && <div className="photo-location">Локация: {photo.location}</div>}
                  </div>
                ) : null}
                {photo.comment || photo.date || photo.location ? (
                  <span className="edit-icon" onClick={() => startEditing(index, photo)}>✏️</span>
                ) : (
                  <button className="add-description-button" onClick={() => startEditing(index, photo)}>
                    Добавить описание
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MonthPhotos;