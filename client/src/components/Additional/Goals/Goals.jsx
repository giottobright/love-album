import React from 'react';
import { Link } from 'react-router-dom';
import '../AdditionalTheme.css';

function Goals() {
  return (
    <div className="theme-container">
      <h2>Цели</h2>
      <p>Содержимое страницы целей...</p>
      <Link to="/additional" className="back-link">Назад</Link>
    </div>
  );
}

export default Goals;