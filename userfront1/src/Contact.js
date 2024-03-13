// Contact.js
import React from 'react';
import styles from './Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <h1 className="header">Contact information</h1>
      <p className="intro">
        In case of any issues regarding the application, data, questions, please contact us through:
      </p>
      <div className="contactInfo">
        <p className="phone">
          <span className={styles.icon}>📞</span> 045962xxxx
        </p>
        <p className="email">
          <span className={styles.icon}>📧</span> example@xxx.com
        </p>
      </div>
    </div>
  );
};

export default Contact;

