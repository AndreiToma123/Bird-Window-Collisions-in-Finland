import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap, Marker} from 'react-leaflet';
import L from 'leaflet';
import customIconUrl from '../Picture/Map_Location_Symbol.png'; // 更换为您的图标路径
import 'leaflet/dist/leaflet.css';
import './report.css'; 

function UploadForm() {
  const [headImage, setHeadImage] = useState(null);
  const [bodyImage, setBodyImage] = useState(null);
  const [tailImage, setTailImage] = useState(null);
  const [description, setDescription] = useState(''); 
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: 60.1699, lng: 24.9384 }, 
    error: null
  });

  const customIcon = L.icon({
    iconUrl: customIconUrl,
    iconSize: [38, 95], // 根据需要调整大小
    iconAnchor: [22, 94], // 根据需要调整锚点位置
    popupAnchor: [-3, -76] // 根据需要调整弹出窗口的锚点位置
  });

  function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
      map.setView(center);
    }, [center, map]);
  
    return null;
  }

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setSelectedLocation(e.latlng); // 当用户点击地图时更新 selectedLocation
      },
    });
    return null;
  };
  
  

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
            coordinates: { lat: 60.1699, lng: 24.9384 }, // 设置默认坐标为赫尔辛基
            error: 'Location permission denied or error occurred'
          }));
        }
      );
    }
  }, []);
  

  const handleImageChange = (event, setImage) => {
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit logic goes here...
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
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="image-upload-container">
          {/* Image upload for Head */}
          <div className="image-upload">
            {headImage && <img src={headImage} alt="Head Preview" className="image-preview" />}
            <label>
              Head
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setHeadImage)}
              />
            </label>
          </div>
  
          {/* Image upload for Body */}
          <div className="image-upload">
            {bodyImage && <img src={bodyImage} alt="Body Preview" className="image-preview" />}
            <label>
              Body
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setBodyImage)}
              />
            </label>
          </div>
  
          {/* Image upload for Tail */}
          <div className="image-upload">
            {tailImage && <img src={tailImage} alt="Tail Preview" className="image-preview" />}
            <label>
              Tail
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setTailImage)}
              />
            </label>
          </div>
        </div>
  
        {/* Description Text Area */}
        <div className="description-container">
          <h3>Description</h3>
          <textarea
            placeholder="Enter your description here"
            value={description}
            onChange={handleDescriptionChange}
            className="description-textarea"
          />
        </div>

        {/* 地图容器 */}
        <div className="map-container" style={{ height: '400px', width: '100%' }}>
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

        {/* 显示选中坐标 */}
        <div>
          {selectedLocation && (
          <p>Selected Coordinates: Latitude: {selectedLocation.lat}, Longitude: {selectedLocation.lng}</p>
          )}
          <button onClick={handleSaveLocation}>Save Location</button>
        </div>

        {/* 显示当前位置数据 */}
        <div>
          <h4>Location data:</h4>
          {location.loaded ? (
            location.error ? <p>{location.error}</p> : <p>Latitude: {location.coordinates.lat}, Longitude: {location.coordinates.lng}</p>
          ) : (
            <p>Loading location...</p>
          )}
        </div>

        {/* 提交按钮 */}
        <div className="submit-button-container">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
  
}

export default UploadForm;           