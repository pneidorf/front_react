import React, { useEffect,useState } from 'react';
import { MapContainer, TileLayer, ImageOverlay, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

function WindowBlock({onImageLoaded}) {
  const [activeTab, setActiveTab] = useState('plots');

  const [imageBase64, setImageBase64] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:5000/generate_signal');
        
        if (result.data.imageBase64) {
          setImageBase64(result.data.imageBase64);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    if (onImageLoaded) {
      onImageLoaded({ imageBase64});
    }
  }, []); 

  const [markersData, setMarkersData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:5173/termalmapdata.json');
        
        if (result.data && Array.isArray(result.data)) {
          setMarkersData(result.data.map(data => ({
            position: [data.latitude, data.longitude],
            key: data.id,
          })));
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);



  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="window-block">
      <div className="tabs-container">
        <div className="tabs">
          <button className='shadow-gradient-button' onClick={() => handleTabClick('plots')}>Plots</button>
          <button className='shadow-gradient-button' onClick={() => handleTabClick('map')}>Map</button>
          <button className='shadow-gradient-button' onClick={() => handleTabClick('sin')}>Sin</button>
        </div>
      </div>
      <div className='map-block'>
        <div className="map-container">
          {activeTab === 'plots' && 
          <div className='map-block'>
            <div className='map-container-small'>
              Тут будут графики
            </div>  
            <form className='map-container-form'>
              <input placeholder='Bandwith' />
              <input placeholder='...'/>
              <input placeholder='...'/>
              <input placeholder='...'/>
              <input placeholder='...'/>
              <button className='form-button' type='button'>Рассчитать</button>
            </form>
          </div>}
          
          {activeTab === 'map' && 
          <MapContainer center={[55.0152, 82.9296]} zoom={13} style={{ height: "570px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <ImageOverlay
              url={`data:image/svg+xml;base64,${imageBase64}`}
              bounds={[
                [55.0152, 82.9296],
                [55.1, 82.9754]
              ]}
            />
            {markersData.length > 0 && markersData.map(marker => (
              <Marker position={marker.position} key={marker.key} />
            ))}
          </MapContainer>}

          {activeTab === 'sin' && <div>Пустая страница</div>}
        </div>
      </div>
    </div>
  );
}

export default WindowBlock;
