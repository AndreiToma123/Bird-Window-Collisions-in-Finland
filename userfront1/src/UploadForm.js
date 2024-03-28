import React, { useState, useEffect } from 'react';
// import imageCompression from 'browser-image-compression';
function UploadForm() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
    error: null,
  });
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            loaded: true,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (error) => {
          console.error('Error getting the geolocation: ', error);
          setLocation({
            loaded: true,
            error: 'Failed to retrieve location. ' + error.message,
          });
        }
      );
    } else {
      setLocation({
        loaded: true,
        error: "Geolocation not supported",
      });
    }
  }, []);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const resetForm = () => {
    setSelectedFiles([]);
    setDescription('');
    setUploadStatus('Upload successful');
  };  

  async function compressFile(file) {
    const options = {
      maxSizeMB: 10, // 最大文件大小
      useWebWorker: true,
    };

  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const compressedFile = await compressFile(selectedFiles[i]);
        formData.append('images', compressedFile, compressedFile.name); // 使用压缩后的图片
      }
      formData.append('description', description);
      formData.append('location', JSON.stringify(location.coordinates));

      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        resetForm();
      } else {
        setUploadStatus('Upload failed');
      }
    } catch (error) {
      console.error('Error during compression or upload:', error);
      setUploadStatus('Error during compression or upload: ' + error.message);
    }
  };

  
  return (
    <div style={{ margin: '0 auto', width: '100%', maxWidth: '500px' }}>
      <form onSubmit={handleSubmit}>
        <label>
          Upload Images (1 to 3):
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        <br />
        <label>
          Description (optional):
          <textarea
            value={description}
            onChange={handleDescriptionChange}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h4>Location data:</h4>
        {location.loaded ? (
          location.error ? <p>{location.error}</p> : <p>Latitude: {location.coordinates.lat}, Longitude: {location.coordinates.lng}</p>
        ) : (
          <p>Loading location...</p>
        )}
      </div>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
}

export default UploadForm;
