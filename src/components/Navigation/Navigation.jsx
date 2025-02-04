import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import './Navigation.css';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="bottom-navigation">
      <Link 
        to="/home" 
        className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`}
      >
        <HomeIcon className="nav-icon" />
        <span className="nav-label">Главная</span>
      </Link>
      <Link 
        to="/photoalbum" 
        className={`nav-item ${location.pathname === '/photoalbum' ? 'active' : ''}`}
      >
        <PhotoAlbumIcon className="nav-icon" />
        <span className="nav-label">Фотоальбом</span>
      </Link>
      <Link 
        to="/additional" 
        className={`nav-item ${location.pathname.startsWith('/additional') ? 'active' : ''}`}
      >
        <MoreHorizIcon className="nav-icon" />
        <span className="nav-label">Дополнительно</span>
      </Link>
    </nav>
  );
}

export default Navigation;