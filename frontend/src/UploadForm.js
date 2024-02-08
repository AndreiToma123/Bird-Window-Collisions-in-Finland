import React, { useState, useEffect } from 'react';

function UploadForm() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
  });

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
            error,
          });
        }
      );
    } else {
      setLocation({
        loaded: true,
        error: { message: "Geolocation not supported" },
      });
    }
  }, []);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('images', selectedFiles[i]);
    }
    formData.append('description', description);
    formData.append('location', JSON.stringify(location.coordinates));

    try {
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        console.log('Upload successful');
        // Reset the form or handle success
      } else {
        console.error('Upload failed');
        // Handle error
      }
    } catch (error) {
      console.error('Error during upload:', error);
      // Handle error
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
          <p>
            Latitude: {location.coordinates.lat}, Longitude: {location.coordinates.lng}
          </p>
        ) : (
          <p>Loading location...</p>
        )}
      </div>
    </div>
  );
}

export default UploadForm;
