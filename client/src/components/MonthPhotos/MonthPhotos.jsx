import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import './MonthPhotos.css';

function MonthPhotos() {
  const { monthKey } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);

  // Состояния для редактирования фото (описание, дата, локация) и изменения картинки
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingComment, setEditingComment] = useState('');
  const [editingDate, setEditingDate] = useState('');
  const [editingLocation, setEditingLocation] = useState('');
  const [editingFile, setEditingFile] = useState(null);

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
    setEditingFile(null);
  };

  // Сохранение отредактированных данных выбранного фото (в том числе замена фото, если выбрано новое)
  const saveEditedCaption = (index) => {
    const newPhotos = [...photos];
    newPhotos[index].comment = editingComment;
    newPhotos[index].date = editingDate;
    newPhotos[index].location = editingLocation;
    if (editingFile) {
      newPhotos[index].url = URL.createObjectURL(editingFile);
    }
    setPhotos(newPhotos);
    const saved = localStorage.getItem('photo-album');
    let data = saved ? JSON.parse(saved) : {};
    data[monthKey] = { photos: newPhotos };
    localStorage.setItem('photo-album', JSON.stringify(data));
    setEditingIndex(null);
    setEditingComment('');
    setEditingDate('');
    setEditingLocation('');
    setEditingFile(null);
  };

  // Удаление фото вместе с его данными
  const deletePhoto = (index) => {
    if (window.confirm('Вы действительно хотите удалить это фото?')) {
      const newPhotos = photos.filter((_, i) => i !== index);
      setPhotos(newPhotos);
      const saved = localStorage.getItem('photo-album');
      let data = saved ? JSON.parse(saved) : {};
      data[monthKey] = { photos: newPhotos };
      localStorage.setItem('photo-album', JSON.stringify(data));
    }
  };

  return (
    <div className="month-photos-container">
      <header className="month-header">
        <button onClick={() => navigate('/photoalbum')} className="back-button">
          ←
        </button>
        <div className="month-title-wrapper">
          <h1>{format(monthDate, 'LLLL yyyy', { locale: ru })}</h1>
        </div>
        <button className="add-photo-btn" onClick={() => setShowAddModal(true)}>
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

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

      <div className="photos-feed">
        {photos.map((photo, index) => (
          <div key={index} className="photo-item">
            <img src={photo.url} alt="Фото" />
            {editingIndex === index ? (
              <div className="photo-caption editing">
                <label>
                  Сменить изображение:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        setEditingFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                {editingFile && (
                  <img
                    src={URL.createObjectURL(editingFile)}
                    alt="Новое фото"
                    className="editing-photo-preview"
                  />
                )}
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
                ) : (
                  <button className="add-description-button" onClick={() => startEditing(index, photo)}>
                    Добавить описание
                  </button>
                )}
                <div className="photo-actions">
                  {photo.comment || photo.date || photo.location ? (
                    <span className="edit-icon" onClick={() => startEditing(index, photo)}>
                      ✏️
                    </span>
                  ) : null}
                  <span className="delete-icon" onClick={() => deletePhoto(index)}>
                    🗑️
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MonthPhotos;