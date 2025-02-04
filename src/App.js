import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import PhotoAlbum from './components/Photoalbum/PhotoAlbum';
import Calendar from './components/Calendar/Calendar';
import Additional from './components/Additional/Additional';
import Recipes from './components/Additional/Receipes/Recipes';
import Films from './components/Additional/Films/Films';
import Travels from './components/Additional/Travels/Travels';
import Goals from './components/Additional/Goals/Goals';
import Wishlist from './components/Additional/Wishlist/Wishlist';
import Navigation from './components/Navigation/Navigation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/photoalbum" element={<PhotoAlbum />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/additional/*" element={<Additional />}>
            {/* При переходе по "/additional" по умолчанию открывается Recipes */}
            <Route index element={<Recipes />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="films" element={<Films />} />
            <Route path="travels" element={<Travels />} />
            <Route path="goals" element={<Goals />} />
            <Route path="wishlist" element={<Wishlist />} />
          </Route>
        </Routes>
      </div>
      <Navigation />
    </Router>
  );
}

export default App;