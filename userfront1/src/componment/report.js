import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap, Marker} from 'react-leaflet';
import L from 'leaflet';
import customIconUrl from '../Picture/Map_Location_Symbol.png';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import './report.css'; 
import Modal from './Modal';
import imageCompression from 'browser-image-compression';



const BIRD_LIST = ['Mute Swan', 'Tundra Swan', 'Whooper Swan', 'Bean Goose', 'Taiga Bean Goose', 'Tundra Bean Goose', 'Pink-footed Goose', 'Greater White-fronted Goose', 'Lesser White-fronted Goose', 'Greylag Goose', 'Bar-headed Goose', 'Canada Goose', 'Cackling Goose', 'Barnacle Goose', 'Brant', 'Red-breasted Goose', 'Ruddy Shelduck', 'Common Shelduck', 'Mandarin Duck', 'Eurasian Wigeon', 'American Wigeon', 'Gadwall', 'Baikal Teal', 'Eurasian Teal', 'Green-winged Teal', 'Mallard', 'American Black Duck', 'Northern Pintail', 'Garganey', 'Blue-winged Teal', 'Northern Shoveler', 'Red-crested Pochard', 'Common Pochard', 'Ring-necked Duck', 'Ferruginous Duck', 'Tufted Duck', 'Greater Scaup', 'Lesser Scaup', 'Common Eider', 'King Eider', "Steller's Eider", 'Harlequin Duck', 'Long-tailed Duck', 'Common Scoter', 'Black Scoter', 'Surf Scoter', 'Velvet Scoter', 'White-winged Scoter', 'Siberian Scoter', 'Common Goldeneye', 'Smew', 'Red-breasted Merganser', 'Common Merganser', 'Ruddy Duck', 'Common Quail', 'Hazel Grouse', 'Willow Ptarmigan', 'Rock Ptarmigan', 'Black Grouse', 'Western Capercaillie', 'Black Grouse × Western Capercaillie (hybrid)', 'Grey Partridge', 'Common Pheasant', 'Red-throated Loon', 'Black-throated Loon', 'Pacific Loon', 'Common Loon', 'Yellow-billed Loon', 'Little Grebe', 'Great Crested Grebe', 'Red-necked Grebe', 'Horned Grebe', 'Black-necked Grebe', 'Northern Fulmar', 'Sooty Shearwater', 'Manx Shearwater', 'European Storm Petrel', "Leach's Storm Petrel", 'Band-rumped Storm Petrel', 'Northern Gannet', 'Great Cormorant', 'European Shag', 'Pygmy Cormorant', 'Great White Pelican', 'Eurasian Bittern', 'Little Bittern', 'Black-crowned Night Heron', 'Squacco Heron', 'Cattle Egret', 'Little Egret', 'Great Egret', 'Grey Heron', 'Purple Heron', 'Black Stork', 'White Stork', 'Glossy Ibis', 'Eurasian Spoonbill', 'European Honey Buzzard', 'Black Kite', 'Red Kite', 'White-tailed Sea Eagle', 'Egyptian Vulture', 'Griffon Vulture', 'Cinereous Vulture', 'Short-toed Snake Eagle', 'Western Marsh Harrier', 'Hen Harrier × Pallid Harrier (hybrid)', "Pallid Harrier × Montagu's Harrier (hybrid)", 'Hen Harrier', 'Pallid Harrier', "Montagu's Harrier", 'Northern Goshawk', 'Eurasian Sparrowhawk', 'Common Buzzard', 'Common Buzzard (Western)', 'Common Buzzard (Steppe)', 'Long-legged Buzzard', 'Rough-legged Buzzard', 'Greater Spotted Eagle', 'Lesser Spotted Eagle', 'Booted Eagle', 'Golden Eagle', 'Steppe Eagle', 'Eastern Imperial Eagle', 'Osprey', 'Lesser Kestrel', 'Common Kestrel', 'Red-footed Falcon', 'Merlin', 'Eurasian Hobby', "Eleonora's Falcon", 'Saker Falcon', 'Gyrfalcon', 'Peregrine Falcon', 'Water Rail', 'Spotted Crake', 'Little Crake', "Baillon's Crake", 'Corn Crake', 'Common Moorhen', 'Eurasian Coot', 'Common Crane', 'Sandhill Crane', 'Demoiselle Crane', 'Little Bustard', "Macqueen's Bustard", 'Great Bustard', 'Eurasian Stone-curlew', 'Black-winged Stilt', 'Pied Avocet', 'Eurasian Oystercatcher', 'Pacific Golden Plover', 'American Golden Plover', 'European Golden Plover', 'Grey Plover', 'Sociable Lapwing', 'White-tailed Lapwing', 'Northern Lapwing', 'Little Ringed Plover', 'Common Ringed Plover', 'Kentish Plover', 'Lesser Sand Plover', 'Greater Sand Plover', 'Caspian Plover', 'Oriental Plover', 'Eurasian Dotterel', 'Upland Sandpiper', 'Little Curlew', 'Whimbrel', 'Eurasian Curlew', 'Black-tailed Godwit', 'Bar-tailed Godwit', 'Ruddy Turnstone', 'Red Knot', 'Ruff', 'Sharp-tailed Sandpiper', 'Broad-billed Sandpiper', 'Curlew Sandpiper', 'Stilt Sandpiper', 'Red-necked Stint', 'Long-toed Stint', "Temminck's Stint", 'Sanderling', 'Dunlin', 'Dunlin (Short-billed)', 'Dunlin (nominate)', 'Purple Sandpiper', "Baird's Sandpiper", 'Little Stint', 'White-rumped Sandpiper', 'Least Sandpiper', 'Buff-breasted Sandpiper', 'Pectoral Sandpiper', "Wilson's Phalarope", 'Red-necked Phalarope', 'Red Phalarope', 'Terek Sandpiper', 'Common Sandpiper', 'Spotted Sandpiper', 'Green Sandpiper', 'Spotted Redshank', 'Common Greenshank', 'Lesser Yellowlegs', 'Marsh Sandpiper', 'Wood Sandpiper', 'Common Redshank', 'Jack Snipe', 'Long-billed Dowitcher', 'Eurasian Woodcock', 'Common Snipe', "Wilson's Snipe", 'Great Snipe', "Swinhoe's Snipe", 'Collared Pratincole', 'Oriental Pratincole', 'Black-winged Pratincole', 'Cream-coloured Courser', 'Pomarine Jaeger', 'Parasitic Jaeger', 'Long-tailed Jaeger', 'Great Skua', 'Atlantic Puffin', 'Black Guillemot', 'Ancient Murrelet', 'Razorbill', 'Little Auk', 'Common Murre', 'Thick-billed Murre', 'Little Tern', 'Gull-billed Tern', 'Caspian Tern', 'Whiskered Tern', 'Black Tern', 'White-winged Tern', 'Sandwich Tern', 'Common Tern', 'Arctic Tern', 'Little Gull', "Ross's Gull", 'Ivory Gull', "Sabine's Gull", 'Black-legged Kittiwake', 'Slender-billed Gull', 'Black-headed Gull', 'Laughing Gull', 'Mediterranean Gull', 'Mew Gull', 'Lesser Black-backed Gull', 'Lesser Black-backed Gull (fuscus)', "Heuglin's Gull", 'Lesser Black-backed Gull (graellsii)', 'European Herring Gull', 'European Herring Gull (Scandinavian)', 'Caspian Gull', 'Yellow-legged Gull', 'Slaty-backed Gull', 'Iceland Gull', 'Glaucous Gull', 'Great Black-backed Gull', "Pallas's Sandgrouse", 'Rock Dove', 'Rock Dove (Feral Pigeon)', 'Stock Dove', 'Common Wood Pigeon', 'Eurasian Collared Dove', 'European Turtle Dove', 'Oriental Turtle Dove', 'Great Spotted Cuckoo', 'Common Cuckoo', 'Oriental Cuckoo', 'Western Barn Owl', 'Eurasian Scops Owl', 'Eurasian Eagle-owl', 'Snowy Owl', 'Northern Hawk-Owl', 'Eurasian Pygmy Owl', 'Little Owl', 'Tawny Owl', 'Tawny Owl (Grey form)', 'Ural Owl', 'Great Grey Owl', 'Long-eared Owl', 'Short-eared Owl', 'Boreal Owl', 'European Nightjar', 'White-throated Needletail', 'Common Swift', 'Pallid Swift', 'White-rumped Swift', 'Common Kingfisher', 'European Bee-eater', 'Blue-cheeked Bee-eater', 'European Roller', 'Eurasian Hoopoe', 'Eurasian Wryneck', 'Grey-headed Woodpecker', 'European Green Woodpecker', 'Black Woodpecker', 'Great Spotted Woodpecker', 'Middle Spotted Woodpecker', 'White-backed Woodpecker', 'Lesser Spotted Woodpecker', 'Eurasian Three-toed Woodpecker', 'Calandra Lark', 'Bimaculated Lark', 'White-winged Lark', 'Greater Short-toed Lark', 'Lesser Short-toed Lark', 'Crested Lark', 'Woodlark', 'Eurasian Skylark', 'Horned Lark', 'Sand Martin', 'Eurasian Crag Martin', 'Barn Swallow', 'Common House Martin', 'Red-rumped Swallow', "Richard's Pipit", "Blyth's Pipit", 'Tawny Pipit', 'Olive-backed Pipit', 'Tree Pipit', 'Meadow Pipit', 'Red-throated Pipit', 'Eurasian Rock Pipit', 'Western Yellow Wagtail', 'Western Yellow Wagtail (nominate)', 'Western Yellow Wagtail (Grey-headed)', 'Western Yellow Wagtail (Yellowish-crowned)', 'Citrine Wagtail', 'Grey Wagtail', 'White Wagtail', 'Bohemian Waxwing', 'White-throated Dipper', 'Eurasian Wren', 'Dunnock', 'Siberian Accentor', 'Black-throated Accentor', 'Alpine Accentor', 'Rufous-tailed Scrub Robin', 'European Robin', 'Thrush Nightingale', 'Common Nightingale', 'Bluethroat', 'Bluethroat (White-spotted)', 'Bluethroat (Northern)', 'Siberian Rubythroat', 'Red-flanked Bluetail', 'White-throated Irania', 'Black Redstart', 'Black Redstart (subspecies phoenicuroides)', 'Common Redstart', 'Whinchat', 'Pied Bush Chat', 'Siberian Stonechat', 'Amur Stonechat', 'European Stonechat', 'Isabelline Wheatear', 'Northern Wheatear', 'Pied Wheatear', 'Black-eared Wheatear', 'Desert Wheatear', 'Common Rock Thrush', 'Blue Rock Thrush', "White's Thrush", 'Ring Ouzel', 'Common Blackbird', 'Eyebrowed Thrush', "Naumann's Thrush", 'Dusky Thrush', 'Black-throated Thrush', 'Fieldfare', 'Song Thrush', 'Redwing', 'Mistle Thrush', "Pallas's Grasshopper Warbler", 'Lanceolated Warbler', 'Common Grasshopper Warbler', 'River Warbler', "Savi's Warbler", 'Booted Warbler', "Sykes's Warbler", 'Eastern Olivaceous Warbler', 'Icterine Warbler', 'Aquatic Warbler', 'Sedge Warbler', 'Paddyfield Warbler', "Blyth's Reed Warbler", 'Marsh Warbler', 'Common Reed Warbler', 'Great Reed Warbler', 'Dartford Warbler', 'Subalpine Warbler', 'Sardinian Warbler', 'Asian Desert Warbler', 'Barred Warbler', 'Lesser Whitethroat', 'Common Whitethroat', 'Garden Warbler', 'Eurasian Blackcap', 'Eastern Crowned Warbler', 'Two-barred Warbler', 'Greenish Warbler', 'Arctic Warbler', "Pallas's Leaf Warbler", 'Yellow-browed Warbler', "Hume's Leaf Warbler", "Radde's Warbler", 'Dusky Warbler', "Western Bonelli's Warbler", "Eastern Bonelli's Warbler", 'Wood Warbler', 'Common Chiffchaff', 'Common Chiffchaff (collybita)', 'Siberian Chiffchaff', 'Chiffchaff (subspecies abietinus)', 'Iberian Chiffchaff', 'Willow Warbler', 'Kamchatka Leaf Warbler', 'Goldcrest', 'Common Firecrest', 'Spotted Flycatcher', 'Red-breasted Flycatcher', 'Taiga Flycatcher', 'Collared Flycatcher', 'European Pied Flycatcher', 'Bearded Reedling', 'Long-tailed Tit', 'Long-tailed Tit (nominate)', 'Azure Tit', 'Eurasian Blue Tit', 'Great Tit', 'Coal Tit', 'European Crested Tit', 'Marsh Tit', 'Willow Tit', 'Siberian Tit', 'Eurasian Nuthatch', 'Eurasian Nuthatch (Northern)', 'Eurasian Nuthatch (asiatica)', 'Eurasian Treecreeper', 'Eurasian Penduline Tit', 'Eurasian Golden Oriole', 'Brown Shrike', 'Isabelline Shrike', 'Red-backed Shrike', 'Lesser Grey Shrike', 'Great Grey Shrike', 'Southern Grey Shrike', 'Woodchat Shrike', 'Masked Shrike', 'Eurasian Jay', 'Siberian Jay', 'Eurasian Magpie', 'Spotted Nutcracker', 'Spotted Nutcracker (nominate)', 'Spotted Nutcracker (Slender-billed)', 'Western Jackdaw', 'Western Jackdaw (nominate)', 'Western Jackdaw (soemmerringii)', 'Daurian Jackdaw', 'Rook', 'Carrion Crow', 'Hooded Crow', 'Carrion Crow (nominate)', 'Northern Raven', 'Common Starling', 'Rosy Starling', 'House Sparrow', 'Eurasian Tree Sparrow', 'Common Chaffinch', 'Brambling', 'European Serin', 'Citril Finch', 'European Greenfinch', 'European Goldfinch', 'Eurasian Siskin', 'Common Linnet', 'Twite', 'Common Redpoll', 'Lesser Redpoll', 'Mealy Redpoll', 'Common Redpoll (holboellii)', 'Arctic Redpoll', 'Two-barred Crossbill', 'Red Crossbill', 'Parrot Crossbill', 'Common Rosefinch', 'Trumpeter Finch', 'Pine Grosbeak', 'Eurasian Bullfinch', 'Hawfinch', 'Fox Sparrow', 'White-throated Sparrow', 'Lapland Longspur', 'Snow Bunting', 'Black-faced Bunting', 'Pine Bunting', 'Yellowhammer', 'Ortolan Bunting', 'Grey-necked Bunting', "Cretzschmar's Bunting", 'Rustic Bunting', 'Little Bunting', 'Chestnut Bunting', 'Yellow-breasted Bunting', 'Common Reed Bunting', "Pallas's Reed Bunting", 'Red-headed Bunting', 'Black-headed Bunting', 'Corn Bunting']

const placeholderText = `Please provide a detailed description of the bird collision event, e.g.:
- Weather conditions
- Distance from the window
- Lethal or non-lethal collision`;


function UploadForm() {
  const [headImage, setHeadImage] = useState({ file: null, preview: null });
const [bodyImage, setBodyImage] = useState({ file: null, preview: null });
const [tailImage, setTailImage] = useState({ file: null, preview: null });

  const [description, setDescription] = useState(''); 
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
  const [birdSearch, setBirdSearch] = useState('');
  const [filteredBirds, setFilteredBirds] = useState(BIRD_LIST);
  const [selectedBird, setSelectedBird] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);



  const handleBirdSelect = (bird) => {
    setSelectedBird(bird); // 保存选中的鸟类
    setBirdSearch(bird); // 更新搜索框显示选中的鸟类
    setFilteredBirds([]); // 清空下拉菜单来关闭它
  };
  
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

  const handleFocus = () => {
    setShowDropdown(true);
    setFilteredBirds(BIRD_LIST); // 假设你想在获得焦点时显示所有鸟类
  };

  const handleBlur = () => {
    setShowDropdown(false);
  };
  

  const handleBirdSearchChange = (event) => {
    const searchTerm = event.target.value;
    setBirdSearch(searchTerm);
  
    if (searchTerm) {
      const filtered = BIRD_LIST.filter(bird =>
        bird.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBirds(filtered);
    } else {
      setFilteredBirds([]); // 输入为空时不显示任何鸟类
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
        case 'belly':
            setBodyImage({ file: file, preview: previewUrl });
            break;
        case 'back':
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
          {['head', 'belly', 'back'].map((part) => (
            <div className="image-upload" key={part}>
              <input
                id={`image-upload-${part}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(part, e)}
                className="image-upload-input"
              />

              {part === 'head' && headImage && (
                <img src={headImage} alt="Head Preview" className="image-preview" />
              )}
              {part === 'belly' && bodyImage && (
                <img src={bodyImage} alt="Belly Preview" className="image-preview" />
              )}
              {part === 'back' && tailImage && (
                <img src={tailImage} alt="Back Preview" className="image-preview" />
              )}
              <div className="image-upload-text">
                {part.charAt(0).toUpperCase() + part.slice(1)}
                <img
                    src="../Picture/camera.png"
                    className="image-upload-camera-icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        openModal(part);
                    }}
                />
              </div>
              
            </div>
          ))}

          </div>
          <h4>Search for a Bird</h4>
          <div className="bird-search-container">
              <input 
                type="text"
                value={birdSearch}
                onChange={handleBirdSearchChange}
                onFocus={handleFocus}
                placeholder="Type to search for a bird..."
                className="bird-search-input"
              />
            {showDropdown && (
              <ul className="bird-search-dropdown">
                {filteredBirds.map(bird => (
                  <li key={bird} onClick={() => handleBirdSelect(bird)}>{bird}</li>
                ))}
              </ul>
            )}
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

            <div className ="timestamp-container">
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
