import React from 'react';
import './About.css';



function About() {
  return (
    <div className="about-container">
      <h2>About us</h2>
      <p>Welcome to WingSave, a pioneering website and mobile application dedicated to addressing the overlooked issue of bird-window collisions in Finland. Our mission is simple yet impactful: to gather essential data on these incidents to protect our feathered friends and preserve biodiversity.</p>
      <h2>Our Features:</h2>
      <ul>
        <li>Multilingual Interface: Navigate easily in English, Finnish, or Swedish.</li>
        <li>Simple Observation Submission: Upload photos and details of collision events with just a few taps.</li>
        <li>Educational Insight: Learn about the species involved and how we can prevent future collisions.</li>
      </ul>
      <h2>Join us in making a difference. Every observation counts.</h2>
    </div>
  );
}

export default About;
