import React from 'react';
import './App.css';
import HomeScreen from './Screens/HomeScreen'; // Ensure this path is correct
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import routing components

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* HomeScreen route */}
          <Route path="/" element={<HomeScreen />} />

          {/* Additional routes can be added here in the future */}
          {/* Example: <Route path="/about" element={<AboutScreen />} /> */}

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
