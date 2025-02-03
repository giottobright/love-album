import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendar from './components/Calendar/Calendar';
import PhotoAlbum from './components/Photoalbum/PhotoAlbum';
import Navigation from './components/Navigation/Navigation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<PhotoAlbum />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </div>
      <Navigation />
    </Router>
  );
}

export default App;