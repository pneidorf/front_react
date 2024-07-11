import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, ImageOverlay, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'
import Moveable from 'react-moveable'

function WindowBlock({ onImageLoaded }) {
  const [activeTab, setActiveTab] = useState('plots')

  const [imageBase64, setImageBase64] = useState('')
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:5000/generate_signal')

        if (result.data.imageBase64) {
          setImageBase64(result.data.imageBase64)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()

    if (onImageLoaded) {
      onImageLoaded({ imageBase64 })
    }
  }, [])

  const [markersData, setMarkersData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        //const result = await axios.get('http://localhost:5173/termalmapdata.json');
        const result = await axios.get('http://45.90.218.73:8080/api/sockets/thermalmapdata')

        if (result.data && Array.isArray(result.data)) {
          const filteredData = result.data.filter((_, index) => index % 10 === 0)
          setMarkersData(
            filteredData.map(data => ({
              position: [data.latitude, data.longitude],
              key: data.id,
              rsrp: data.rsrp,
              time: data.time
            }))
          )
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  const handleTabClick = tab => {
    setActiveTab(tab)
  }

  const commonMarkerStyle = `
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    
  `

  const markerStyles = {
    good: `${commonMarkerStyle} background-color: red;`,
    yellow: `${commonMarkerStyle} background-color: yellow;`,
    orange: `${commonMarkerStyle} background-color: orange;`,
    bad: `${commonMarkerStyle} background-color: green;`,
    Sobad: `${commonMarkerStyle} background-color: blue;`
  }

  return (
    <div className='window-block'>
      <div className='tabs-container'>
        <div className='tabs'>
          <button className='shadow-gradient-button' onClick={() => handleTabClick('plots')}>
            Plots
          </button>
          <button className='shadow-gradient-button' onClick={() => handleTabClick('map')}>
            Map
          </button>
          <button className='shadow-gradient-button' onClick={() => handleTabClick('sin')}>
            Sin
          </button>
        </div>
      </div>
      <div className='map-block'>
        <div className='map-container'>
          {activeTab === 'plots' && (
            <div className='map-block'>
              <div className='map-container-small'>Тут будут графики</div>
              <Moveable
                target={'.map-container-small'}
                draggable={true}
                scalable={true}
                rotatable={true}
                pinchable={true}
                pinchOutside={true}
                onRender={e => {
                  e.target.style.cssText += e.cssText
                }}
              />
              <form className='map-container-form'>
                <input placeholder='Bandwith' />
                <input placeholder='...' />
                <input placeholder='...' />
                <input placeholder='...' />
                <input placeholder='...' />
                <button className='form-button' type='button'>
                  Рассчитать
                </button>
                <Moveable
                  target={'.map-container-form'}
                  draggable={true}
                  scalable={true}
                  rotatable={true}
                  pinchable={true}
                  pinchOutside={true}
                  onRender={e => {
                    e.target.style.cssText += e.cssText
                  }}
                />
              </form>
            </div>
          )}

          {activeTab === 'map' && (
            <div className='map-wrapper'>
              <MapContainer
                center={[55.0152, 82.9296]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <ImageOverlay
                  url={`data:image/svg+xml;base64,${imageBase64}`}
                  bounds={[
                    [55.0152, 82.9296],
                    [55.1, 82.9754]
                  ]}
                />
                {markersData.length > 0 &&
                  markersData.map(marker => (
                    <Marker
                      position={marker.position}
                      key={marker.key}
                      rssi={marker.rssi}
                      icon={L.divIcon({
                        className: 'custom-marker',
                        iconSize: [15, 15],
                        iconAnchor: [7.5, 7.5],
                        html:
                          '<div style="' +
                          (() => {
                            if (marker.rsrp >= -80) return markerStyles.good
                            if (-90 < marker.rsrp && marker.rsrp < -80) return markerStyles.orange
                            if (-100 < marker.rsrp && marker.rsrp < -90) return markerStyles.yellow
                            if (-110 < marker.rsrp && marker.rsrp < -100) return markerStyles.bad
                            if (marker.rsrp < -110) return markerStyles.Sobad
                          })() +
                          '">' +
                          '</div>'
                      })}
                    >
                      <Popup>
                        <p>{`Time: ${marker.time}`}</p>
                        <p>{`Rsrp: ${marker.rsrp}`}</p>
                      </Popup>
                    </Marker>
                  ))}
                <img src='../../rsrp.png' alt='RSRP Image' className='rsrp-image' />
              </MapContainer>
              <Moveable
                target={'.map-wrapper'}
                draggable={true}
                scalable={true}
                rotatable={true}
                pinchable={true}
                pinchOutside={true}
                onRender={e => {
                  e.target.style.cssText += e.cssText
                }}
              />
            </div>
          )}

          {activeTab === 'sin' && (
            <Moveable key={activeTab} draggable resizable>
              <div>Пустая страница</div>
            </Moveable>
          )}
        </div>
      </div>
    </div>
  )
}

export default WindowBlock
