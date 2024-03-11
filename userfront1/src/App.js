import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UploadForm from './UploadForm';
import About from './About';
import Contact from './Contact';
import Report from './componment/report';
import Submitted from './Submitted';
import './App.css';

function App() {
  return (
    <Router>
      <div>
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
          <Route path="/submitted" element={<Submitted />} />
          <Route path="/" element={<Report />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
