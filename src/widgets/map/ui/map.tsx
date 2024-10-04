import maplibregl, { Map as MapLibreMap, Marker, NavigationControl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useTheme } from 'next-themes'
import { FC, useEffect, useRef, useState } from 'react'

import { useFetchMarkers } from '~/entities/markers'

export const Map: FC = () => {
  const [lng] = useState(82.9296)
  const [lat] = useState(55.0152)
  const [zoom] = useState(13)

  const map = useRef<MapLibreMap | null>(null)
  const mapContainer = useRef(null)

  const { theme } = useTheme()
  const mapStyle = theme === 'dark' ? 'streets-dark' : 'streets'

  function getMarkerStyleClass(rsrp: number) {
    if (rsrp >= -80) return 'good'
    if (-90 < rsrp && rsrp <= -80) return 'orange'
    if (-100 < rsrp && rsrp <= -90) return 'yellow'
    if (-110 < rsrp && rsrp <= -100) return 'bad'
    if (rsrp < -110) return 'Sobad'
    return 'default'
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
    Sobad: `${commonMarkerStyle} background-color: blue;`,
    default: `${commonMarkerStyle} background-color: gray;`
  }

  const markers = useFetchMarkers()

  useEffect(() => {
    if (!mapContainer.current) return

    map.current = new MapLibreMap({
      container: mapContainer.current,
      center: [lng, lat],
      zoom: zoom,
      style: `https://api.maptiler.com/maps/${mapStyle}/style.json?key=${import.meta.env.VITE_MAPLIBRE_API_KEY}`
    })

    const nav = new NavigationControl({
      visualizePitch: true
    })
    map.current.addControl(nav, 'top-left')
  }, [lat, lng, mapStyle, zoom])

  useEffect(() => {
    if (!map.current || !markers.data) return
    markers.data
      ?.filter((_, index) => index % 10 === 0)
      .map(marker => {
        const el = document.createElement('div')

        const markerClass = getMarkerStyleClass(marker.rsrp)
        el.style.cssText = markerStyles[markerClass] || markerStyles['default']

        const htmlPopup = `
        <p><strong>Time:</strong> ${marker.time}</p>
        <p><strong>Rsrp:</strong> ${marker.rsrp}</p>
      `
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(htmlPopup)

        new Marker({ element: el })
          .setLngLat([marker.lon, marker.lat])
          .setPopup(popup)
          .addTo(map.current as MapLibreMap)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers.data])

  return <div className='h-full w-full' ref={mapContainer} />
}
