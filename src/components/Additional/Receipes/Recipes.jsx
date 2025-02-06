import React from 'react';
import { Link } from 'react-router-dom';
import '../AdditionalTheme.css';

function Recipes() {
  return (
    <div className="theme-container">
      <h2>Рецепты</h2>
      <p>Содержимое страницы рецептов...</p>
      <Link to="/additional" className="back-link">Назад</Link>
    </div>
  );
}

export default Recipes;