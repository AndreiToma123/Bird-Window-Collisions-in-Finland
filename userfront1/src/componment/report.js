import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap, Marker} from 'react-leaflet';
import L from 'leaflet';
import customIconUrl from '../Picture/Map_Location_Symbol.png';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import './report.css'; 
import Modal from './Modal';
import imageCompression from 'browser-image-compression';



function UploadForm() {
  const [headImage, setHeadImage] = useState({ file: null, preview: null });
const [bodyImage, setBodyImage] = useState({ file: null, preview: null });
const [tailImage, setTailImage] = useState({ file: null, preview: null });

  const [description, setDescription] = useState(''); 
  const placeholderText = `Please provide a detailed description of the bird collision event, e.g.:
  - Weather conditions
  - Distance from the window
  - Lethal or non-lethal collision`;
  const [isModalOpen, setModalOpen] = useState(false);
  const [activePart, setActivePart] = useState('');
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: 60.1699, lng: 24.9384 }, 
    error: null
  });

  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setTimestamp(localDateTime);
  }, []);
  

  const customIcon = L.icon({
    iconUrl: customIconUrl,
    iconSize: [38, 95], 
    iconAnchor: [22, 94], 
    popupAnchor: [-3, -76] 
  });

  function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
      map.setView(center);
      map.invalidateSize();
    }, [center, map]);
  
    return null;
  }

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setSelectedLocation(e.latlng);
      },
    });
    return null;
  };
  
  const openModal = (part) => {
    setActivePart(part);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };

  const handleFocus = (event) => {
    if (event.target.value === placeholderText) {
      setDescription('');
    }
  };

  const handleBlur = (event) => {
    if (event.target.value === '') {
      setDescription(placeholderText);
    }
  };

  useEffect(() => {
    setDescription(placeholderText);
  }, []);
  

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prevState) => ({
        ...prevState,
        loaded: true,
        error: 'Geolocation is not supported by your browser'
      }));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            loaded: true,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            error: null
          });
        },
        () => {
          setLocation((prevState) => ({
            ...prevState,
            loaded: true,
            coordinates: { lat: 60.1699, lng: 24.9384 }, 
            error: 'Location permission denied or error occurred'
          }));
        }
      );
    }
  }, []);
  

  const handleImageChange = (imageType, event) => {
    console.log(event.target.files); // 直接检查这里是否有值
    if (!event.target.files || event.target.files.length === 0) {
        console.error('No files selected.');
        return;
    }
    const file = event.target.files[0];
    const previewUrl = URL.createObjectURL(file); // 创建文件的URL用于预览

    // 根据传入的imageType决定更新哪个状态
    switch (imageType) {
        case 'head':
            setHeadImage({ file: file, preview: previewUrl });
            break;
        case 'body':
            setBodyImage({ file: file, preview: previewUrl });
            break;
        case 'tail':
            setTailImage({ file: file, preview: previewUrl });
            break;
        default:
            console.error('Invalid image type');
    }
};


  const handleGallery = () => { 
    const fileInput = document.getElementById(`image-upload-${activePart}`);
    if (fileInput) {
      fileInput.click(); 
    }
    closeModal();
  };
  
  
  
  const handleCamera = () => {
    closeModal();
    // This would be the place to implement camera functionality
  };
  async function compressImage(file) {
    const options = {
      maxSizeMB: 10, // 设置最大文件大小为1MB
      maxWidthOrHeight: 1920, // 设置图片的最大宽度或高度
      useWebWorker: true,
    };
  
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Error compressing file:", file.name, error);
      throw error; // 抛出错误以便外部捕获
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
  

    const imageFiles = [headImage, bodyImage, tailImage];
    console.log(imageFiles)

    if (headImage && headImage.file) formData.append('headImage', headImage.file);
  if (bodyImage && bodyImage.file) formData.append('bodyImage', bodyImage.file);
  if (tailImage && tailImage.file) formData.append('tailImage', tailImage.file);

    
    
    

    formData.append('description', description);
    formData.append('timestamp', timestamp);
    formData.append('location', JSON.stringify(location));
    console.log()
      try {
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        // 处理成功逻辑
        navigate('/submitted');
      } else {
        // 处理错误逻辑
        alert('Submission failed. Please try again.');
      }
    } catch (error) {
      // 处理网络请求中的错误
      console.error('Error during submission:', error);
      alert('Submission failed. Please check your internet connection and try again.');
    }
  };

  // const handleDescriptionChange = (event) => {
  //   setDescription(event.target.value);
  // };

  const handleSaveLocation = () => {
    if (selectedLocation) {
      setLocation({ ...location, coordinates: selectedLocation });
    }
  };
  

  return (
    <div className='page-container'>
      <div className="form-container">
        <div className="left-container">
        <form onSubmit={handleSubmit}>
          <div className="image-upload-container">
          {['head', 'body', 'tail'].map((part) => (
            <div className="image-upload" key={part} onClick={() => openModal(part)}>
              <input
                id={`image-upload-${part}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(part, e)}
                className="image-upload-input"
              />
              <label htmlFor={`image-upload-${part}`} className="image-upload-label">
                <div className="image-upload-plus">+</div>
              </label>
              {part === 'head' && headImage && (
                <img src={headImage} alt="Head Preview" className="image-preview" />
              )}
              {part === 'body' && bodyImage && (
                <img src={bodyImage} alt="Body Preview" className="image-preview" />
              )}
              {part === 'tail' && tailImage && (
                <img src={tailImage} alt="Tail Preview" className="image-preview" />
              )}
              <span className="image-upload-text">
                {part.charAt(0).toUpperCase() + part.slice(1)}
              </span>
            </div>
          ))}

          </div>
    
          <div className="description-container">
            <h4>Description</h4>
            <textarea
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="description-textarea"
            />
          </div>

          <div>
            {selectedLocation && (
            <p>Selected Coordinates: Latitude: {selectedLocation.lat}, Longitude: {selectedLocation.lng}</p>
            )}
            <button type='button' onClick={handleSaveLocation} className="save-location-button">Save Location</button>
          </div>

          <div>
            <h4>Location data:</h4>
            {location.loaded ? (
              location.error ? <p>{location.error}</p> : <p>Latitude: {location.coordinates.lat}, Longitude: {location.coordinates.lng}</p>
            ) : (
              <p>Loading location...</p>
            )}

            <div class="timestamp-container">
              <label htmlFor="timestamp">Timestamp:</label>
              <input
                type="datetime-local"
                id="timestamp"
                name="timestamp"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="timestamp-input"
              />
            </div>
          </div>

          </form>
        </div>

        <div className="map-container">
            <MapContainer center={[location.coordinates.lat, location.coordinates.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {selectedLocation && (
                <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={customIcon}></Marker>
              )}
              <LocationPicker />
              <MapUpdater center={[location.coordinates.lat, location.coordinates.lng]} />
            </MapContainer>
        </div>

      </div>

    
      <Modal isOpen={isModalOpen} onClose={closeModal} onGallery={handleGallery} onCamera={handleCamera}>
        <p>Choose an option for uploading a {activePart} image:</p>
      </Modal>
      <div className='buttons-container'>
        <div className="cancel-button-container">
          <button type="cancel">Cancel</button>
        </div> 
        <div className="submit-button-container">
          <button onClick={handleSubmit} className='submit-button-container button'>Submit</button>
        </div>
      </div>
    </div>
    
  );
  
}

export default UploadForm;           
