import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onGallery, onCamera, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
        <div className="modal-actions">
          <button onClick={onGallery}>Upload Picture</button>
          <button onClick={onCamera}>Use Camera</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
