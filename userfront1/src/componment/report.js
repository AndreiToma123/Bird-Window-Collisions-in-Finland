import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap, Marker} from 'react-leaflet';
import L from 'leaflet';
import customIconUrl from '../Picture/Map_Location_Symbol.png';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import './report.css'; 

function UploadForm() {
  const [headImage, setHeadImage] = useState(null);
  const [bodyImage, setBodyImage] = useState(null);
  const [tailImage, setTailImage] = useState(null);
  const [description, setDescription] = useState('');
  const placeholderText = `Please provide a detailed description of the bird collision event, e.g.:
  - Weather conditions
  - Distance from the window
  - Lethal or non-lethal collision`;

  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: 60.1699, lng: 24.9384 }, 
    error: null
  });

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
    const file = event.target.files[0];
    if (file) {
      const imageSetter = imageType === 'head' ? setHeadImage
                          : imageType === 'body' ? setBodyImage
                          : setTailImage;
      imageSetter(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/submitted');
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

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
            <div className="image-upload" key={part}>
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