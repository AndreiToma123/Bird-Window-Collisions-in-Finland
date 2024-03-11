import React from 'react';
import './Submitted.css'; 
import checkmarkImage from './Picture/correct.png';

function Submitted() {
  return (
    <div className="submitted-container">
      <div className="checkmark-container">
        <img src={checkmarkImage} alt="Checkmark" />  
      </div>
      <h2>Submitted!</h2>
      <h2>Help us understand more!</h2>
      <button>Take the Questionnaire</button>
      <button>No, thank you</button>
    </div>
  );
}

export default Submitted;
