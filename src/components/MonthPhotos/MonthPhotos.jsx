import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import { api } from '../../utils/api';
import './MonthPhotos.css';

function MonthPhotos() {
  const { monthKey } = useParams();
  const navigate = useNavigate();

  // Список фотографий, загруженных для выбранного месяца
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Состояния для редактирования фото
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingData, setEditingData] = useState({
    comment: '',
    date: '',
    location: '',
    file: null,
  });

  // Состояния для модального окна добавления фото
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    file: null,
    comment: '',
    date: '',
    location: '',
  });

  const monthDate = parse(monthKey, 'yyyy-MM', new Date());

  // При загрузке компонента (или изменении monthKey) получаем список фотографий из API
  useEffect(() => {
    async function loadPhotos() {
      setIsLoading(true);
      try {
        // Предполагается, что api.fetchPhotos возвращает объект с массивом photos
        const response = await api.fetchPhotos(monthKey);
        setPhotos(response.photos);
      } catch (error) {
        console.error('Ошибка загрузки фотографий:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadPhotos();
  }, [monthKey]);

  // Обработчик добавления нового фото через модальное окно
// ... остальной код ...

async function handleAddPhoto() {
  if (!modalData.file) {
    alert('Выберите фото');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('photo', modalData.file); // Убедитесь, что ключ 'photo' совпадает с серверным
    formData.append('comment', modalData.comment || '');
    formData.append('date', modalData.date || '');
    formData.append('location', modalData.location || '');
    formData.append('monthKey', monthKey); // Добавляем информацию о месяце

    const result = await api.uploadPhoto(formData);
    
    if (result.success) {
      const newPhoto = {
        url: result.photoUrl,
        comment: modalData.comment,
        date: modalData.date,
        location: modalData.location,
      };
      
      setPhotos(prev => [...prev, newPhoto]);
      setShowModal(false);
      setModalData({
        file: null,
        comment: '',
        date: '',
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

  // Редактирование выбранного фото: установка текущих значений
  function startEditing(index) {
    const photo = photos[index];
    setEditingIndex(index);
    setEditingData({
      comment: photo.comment || '',
      date: photo.date || '',
      location: photo.location || '',
      file: null,
    });
  }

  // Сохранение изменений (редактирование) фото
  async function handleSaveEdit(index) {
    const updatedPhoto = { ...photos[index],
      comment: editingData.comment,
      date: editingData.date,
      location: editingData.location,
    };
    if (editingData.file) {
      // Для предпросмотра создаем URL из нового файла; в реальном случае можно вызвать API для обновления
      updatedPhoto.url = URL.createObjectURL(editingData.file);
    }
    // Обновляем состояние фотографий
    const newPhotos = [...photos];
    newPhotos[index] = updatedPhoto;
    setPhotos(newPhotos);
    setEditingIndex(null);
    setEditingData({ comment: '', date: '', location: '', file: null });
    // При необходимости вызовите API для сохранения изменений в базе
  }

  // Удаление фото из списка
  async function handleDeletePhoto(index) {
    if (window.confirm('Вы действительно хотите удалить это фото?')) {
      // Здесь можно также вызвать API для удаления записи в базе
      setPhotos(prev => prev.filter((_, i) => i !== index));
    }
  }

  return (
    <div className="month-photos-container">
      <header className="month-header">
        <button onClick={() => navigate('/photoalbum')} className="back-button">
          ←
        </button>
        <div className="month-title-wrapper">
          <h1>{format(monthDate, 'LLLL yyyy', { locale: ru })}</h1>
        </div>
        <button className="add-photo-btn" onClick={() => setShowModal(true)}>
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Добавить фото</h2>
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
              Описание:
              <textarea
                value={modalData.comment}
                onChange={(e) => setModalData(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Комментарий к фото (необязательно)"
              />
            </label>
            <label>
              Дата:
              <input
                type="date"
                value={modalData.date}
                onChange={(e) => setModalData(prev => ({ ...prev, date: e.target.value }))}
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
              <button onClick={() => setShowModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      <div className="photos-feed">
        {isLoading ? (
          <div>Загрузка...</div>
        ) : (
          photos.map((photo, index) => (
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
                          setEditingData(prev => ({ ...prev, file: e.target.files[0] }));
                        }
                      }}
                    />
                  </label>
                  {editingData.file && (
                    <img
                      src={URL.createObjectURL(editingData.file)}
                      alt="Новое фото"
                      className="editing-photo-preview"
                    />
                  )}
                  <input
                    type="text"
                    value={editingData.comment}
                    onChange={(e) => setEditingData(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Введите описание"
                  />
                  <input
                    type="date"
                    value={editingData.date}
                    onChange={(e) => setEditingData(prev => ({ ...prev, date: e.target.value }))}
                    placeholder="Дата"
                  />
                  <input
                    type="text"
                    value={editingData.location}
                    onChange={(e) => setEditingData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Локация"
                  />
                  <button onClick={() => handleSaveEdit(index)}>Сохранить</button>
                </div>
              ) : (
                <div className="photo-caption">
                  {(photo.comment || photo.date || photo.location) ? (
                    <div className="photo-details">
                      {photo.comment && <div className="photo-comment">{photo.comment}</div>}
                      {photo.date && <div className="photo-date">Дата: {photo.date}</div>}
                      {photo.location && <div className="photo-location">Локация: {photo.location}</div>}
                    </div>
                  ) : (
                    <button className="add-description-button" onClick={() => startEditing(index)}>
                      Добавить описание
                    </button>
                  )}
                  <div className="photo-actions">
                    {(photo.comment || photo.date || photo.location) && (
                      <span className="edit-icon" onClick={() => startEditing(index)}>
                        ✏️
                      </span>
                    )}
                    <span className="delete-icon" onClick={() => handleDeletePhoto(index)}>
                      🗑️
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MonthPhotos;
