import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Componets/login.jsx';
import Gallery from './Componets/Gallery.jsx'; // Add this import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/gallery" element={<Gallery />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;