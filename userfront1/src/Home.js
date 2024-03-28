import React from 'react';
import './Home.css';

function Home() {
  const reportCollision = () => {
    console.log('Report button clicked');
  };

  return (
    
    <div className="container">
      <div className="title-container">
        <h1 className="title">WingSafe</h1>
      </div>
      <div className="subtitle-container">
        <h2 className="subtitle">Report Bird Collision</h2>
      </div>
      <button className="report-button" onClick={reportCollision}>
        Click here to Report
      </button>
    </div>
  );
};

export default Home;
