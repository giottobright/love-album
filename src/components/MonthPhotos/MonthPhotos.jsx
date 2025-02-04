import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import './MonthPhotos.css';

function MonthPhotos() {
  const { monthKey } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('photo-album');
    if (saved) {
      const data = JSON.parse(saved);
      setPhotos(data[monthKey]?.photos || []);
    }
  }, [monthKey]);

  const monthDate = parse(monthKey, 'yyyy-MM', new Date());

  // Состояния для модального окна добавления фото на странице месяца
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedComment, setSelectedComment] = useState('');

  const handleModalSubmit = () => {
    if (!selectedFile) {
      alert('Выберите фото');
      return;
    }
    const newPhoto = {
      url: URL.createObjectURL(selectedFile),
      comment: selectedComment
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
  };

  return (
    <div className="month-photos-container">
      <header className="month-header">
        <button onClick={() => navigate('/photoalbum')} className="back-button">
          ←
        </button>
        <h1>{format(monthDate, 'LLLL yyyy', { locale: ru })}</h1>
      </header>

      {/* Панель добавления фото (без выбора папки) */}
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
                placeholder="Комментарий к фото (необязательно)"
              />
            </label>
            <div className="modal-actions">
              <button onClick={handleModalSubmit}>Добавить</button>
              <button onClick={() => setShowAddModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Лента фото как в Instagram (вертикальное расположение) */}
      <div className="photos-feed">
        {photos.map((photo, index) => (
          <div key={index} className="photo-item">
            <img src={photo.url} alt="Фото" />
            {photo.comment && (
              <div className="photo-caption">
                {photo.comment}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MonthPhotos;