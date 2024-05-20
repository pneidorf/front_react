import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ImgMap({ onImageLoaded, zoomLevel }) {
  const [imageBase64, setImageBase64] = useState('');
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:5000/generate_signal');
        
        if (result.data.imageBase64) {
          setImageBase64(result.data.imageBase64);
        }
        if (result.data.bounds) {
          setBounds(result.data.bounds);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    
    if (onImageLoaded) {
      onImageLoaded({ imageBase64, bounds });
    }
  }, [zoomLevel]); 

  // Расчет нового размера изображения в зависимости от уровня зума
  const imageSize = 20 + ((zoomLevel - 13) * 2); 

  return (
    <img src={`data:image/svg+xml;base64,${imageBase64}`} alt="Generated_Signal" style={{width: `${imageSize}%`, height: `${imageSize}%`, position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)'}} />
  );
}

export default ImgMap;
