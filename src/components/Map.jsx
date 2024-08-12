import React, { useRef, useEffect, useState } from 'react'
import axios from 'axios'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import '../css/map.css'

function createMarker(map, markerData) {
  const el = document.createElement('div')
  const styleClass = getMarkerStyleClass(markerData.rsrp)
  const markerStyle = markerStyles[styleClass]
  el.style.cssText = markerStyle

  const htmlPopup = `
  <p><strong>Time:</strong> ${markerData.time}</p>
  <p><strong>Rsrp:</strong> ${markerData.rsrp}</p>
`
  const popup = new maplibregl.Popup({ offset: 25 }).setHTML(htmlPopup)

  new maplibregl.Marker({ element: el }).setLngLat(markerData.position).setPopup(popup).addTo(map)
}

function getMarkerStyleClass(rsrp) {
  if (rsrp >= -80) return 'good'
  if (-90 < rsrp && rsrp < -80) return 'orange'
  if (-100 < rsrp && rsrp < -90) return 'yellow'
  if (-110 < rsrp && rsrp < -100) return 'bad'
  if (rsrp < -110) return 'Sobad'
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

export default function Map({ isChecked2 }) {
  const [markersData, setMarkersData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://78.24.222.170:8080/api/sockets/thermalmapdata')

        if (result.data && Array.isArray(result.data)) {
          const filteredData = result.data.filter((_, index) => index % 80 === 0)
          setMarkersData(
            filteredData.map(data => ({
              position: [data.longitude, data.latitude],
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
  }, [isChecked2])

  const mapContainerRef = useRef(null)
  const map = useRef(null)
  const [lng] = useState(82.9296)
  const [lat] = useState(55.0152)
  const [zoom] = useState(13)
  const [API_KEY] = useState('UxfHiMzqFSHw3HBVtsft')

  useEffect(() => {
    if (isChecked2 && mapContainerRef.current) {
      map.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
        center: [lng, lat],
        zoom: zoom
      })
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

      markersData.forEach(markerData => {
        createMarker(map.current, markerData)
      })
    }
  }, [API_KEY, lng, lat, zoom, mapContainerRef.current, map.current, isChecked2, markersData])

  return (
    <div className='map-obertka'>
      <div className='map-wrapper' style={{ zIndex: 9999 }} ref={mapContainerRef}></div>
    </div>
  )
}
