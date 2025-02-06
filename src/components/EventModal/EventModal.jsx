import React, { useState, useEffect } from 'react';
import './EventModal.css';

function EventModal({ event, onClose, onDelete, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(event.title);
  const [editedDescription, setEditedDescription] = useState(event.description);

  useEffect(() => {
    setEditedTitle(event.title);
    setEditedDescription(event.description);
  }, [event]);

  const handleSave = () => {
    if (editedTitle.trim() === "") return;
    onSave({ ...event, title: editedTitle, description: editedDescription });
    setIsEditing(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{isEditing ? "Редактировать событие" : "Событие"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </header>
        <div className="modal-body">
          {isEditing ? (
            <>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Название события"
                className="modal-input"
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Описание события"
                className="modal-textarea"
              ></textarea>
            </>
          ) : (
            <>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </>
          )}
        </div>
        <footer className="modal-footer">
          {isEditing ? (
            <>
              <button className="modal-btn save" onClick={handleSave}>Сохранить</button>
              <button className="modal-btn cancel" onClick={() => setIsEditing(false)}>Отмена</button>
            </>
          ) : (
            <>
              <button className="modal-btn edit" onClick={() => setIsEditing(true)}>Редактировать</button>
              <button className="modal-btn delete" onClick={() => onDelete(event.id)}>Удалить</button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}

export default EventModal;