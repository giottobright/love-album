import React from 'react';
import { Link } from 'react-router-dom';
import '../AdditionalTheme.css';

function Travels() {
  return (
    <div className="theme-container">
      <h2>Путешествия</h2>
      <p>Содержимое страницы путешествий...</p>
      <Link to="/additional" className="back-link">Назад</Link>
    </div>
  );
}

export default Travels;