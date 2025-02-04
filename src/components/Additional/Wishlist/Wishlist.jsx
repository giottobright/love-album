import React from 'react';
import { Link } from 'react-router-dom';
import '../AdditionalTheme.css';

function Wishlist() {
  return (
    <div className="theme-container">
      <h2>Wishlist</h2>
      <p>Содержимое страницы Wishlist...</p>
      <Link to="/additional" className="back-link">Назад</Link>
    </div>
  );
}

export default Wishlist;