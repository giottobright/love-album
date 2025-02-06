import React from 'react';
import { Link } from 'react-router-dom';
import '../AdditionalTheme.css';

function Films() {
  return (
    <div className="theme-container">
      <h2>Фильмы</h2>
      <p>Содержимое страницы фильмов...</p>
      <Link to="/additional" className="back-link">Назад</Link>
    </div>
  );
}

export default Films;