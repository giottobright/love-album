import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import './Navigation.css';

function Navigation() {
  const location = useLocation();
  return (
    <nav className="bottom-navigation">
      <Link
        to="/"
        className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
      >
        <PhotoAlbumIcon className="nav-icon" />
        <span className="nav-label">Фото</span>
      </Link>
      <Link
        to="/calendar"
        className={`nav-item ${location.pathname === '/calendar' ? 'active' : ''}`}
      >
        <CalendarTodayIcon className="nav-icon" />
        <span className="nav-label">Календарь</span>
      </Link>
    </nav>
  );
}

export default Navigation;