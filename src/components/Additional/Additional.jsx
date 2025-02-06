import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Additional.css';

function Additional() {
  const menuItems = [
    { title: 'Рецепты', path: 'recipes' },
    { title: 'Фильмы', path: 'films' },
    { title: 'Путешествия', path: 'travels' },
    { title: 'Цели', path: 'goals' },
    { title: 'Wishlist', path: 'wishlist' }
  ];

  return (
    <div className="additional-container">
      <div className="additional-menu">
        {menuItems.map(item => (
          <NavLink 
            key={item.title}
            to={item.path}
            className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}
          >
            {item.title}
          </NavLink>
        ))}
      </div>
      <div className="additional-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Additional;