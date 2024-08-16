import { Map as MapLibreMap, Marker, NavigationControl } from 'maplibre-gl'
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

  const markers = useFetchMarkers()
  markers.data?.map(marker => {
    const el = document.createElement('div')
    el.className = 'marker'
    new Marker({ element: el })
      .setLngLat([marker.lon, marker.lat])
      .addTo(map.current as MapLibreMap)
  })

  return <div className='h-full w-full' ref={mapContainer} />
}
