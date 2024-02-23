import React, { useState, useEffect } from 'react';

function DataList() {
    const [dataItems, setDataItems] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/api/data/unconfirmed')
            .then((response) => response.json())
            .then((data) => setDataItems(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    const handleConfirm = (id, images) => {
        const imagesToKeep = images.filter(image => image.keep).map(image => image.url);
        fetch(`http://localhost:4000/api/data/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, images: imagesToKeep }),
        })
        .then((response) => response.json())
        .then(() => setDataItems(prevItems => prevItems.filter(item => item._id !== id)))
        .catch((error) => console.error('Error:', error));
    };

    const toggleImageSelection = (itemId, imageUrl) => {
        setDataItems(prevItems => prevItems.map(item => item._id === itemId ? {
            ...item,
            images: item.images.map(image => image.url === imageUrl ? { ...image, keep: !image.keep } : image)
        } : item));
    };

    // Helper function to convert Windows backslash paths to URL paths
    const convertImagePath = (imagePath) => {
        return `http://localhost:4000/${imagePath.replace(/\\/g, '/')}`;
    };

    return (
        <div>
            {dataItems.map((item) => (
                <div key={item._id}>
                    <h3>{item.description || 'No Description'}</h3>
                    {item.images.map((image, index) => (
                        <div key={index} style={{ display: 'inline-block', margin: '10px' }}>
                            <img
                                src={convertImagePath(image)}
                                alt="Uploaded content"
                                style={{ width: '100px', height: '100px', border: '2px solid red' }}
                                onClick={() => toggleImageSelection(item._id, convertImagePath(image))}
                            />
                        </div>
                    ))}
                    <button onClick={() => handleConfirm(item._id, item.images)}>Confirm</button>
                </div>
            ))}
        </div>
    );
}

export default DataList;
