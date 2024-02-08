import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UploadForm from './UploadForm';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="App-nav">
          <Link to="/">Home</Link>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/report">Report</Link>
        </nav>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/report" element={<UploadForm />} />
          <Route path="/" element={<Home />} />
        </Routes>
        <footer className="App-footer">
          {/* Footer Content Here */}
        </footer>
      </div>
    </Router>
  );
}

export default App;
//AIzaSyDqngx7br0nozxPIgI4cgQGb2cNnkPfxD4