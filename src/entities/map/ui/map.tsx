import { Map as MapLibreMap, NavigationControl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { FC, useEffect, useState } from 'react'

export const Map: FC = () => {
  const [mapReady, setMapReady] = useState(false)
  const [lng] = useState(82.9296)
  const [lat] = useState(55.0152)
  const [zoom] = useState(13)

  useEffect(() => {
    if (!mapReady) return

    const map = new MapLibreMap({
      container: 'central-map',
      center: [lng, lat],
      zoom: zoom,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${import.meta.env.VITE_MAPLIBRE_API_KEY}`
    })

    const nav = new NavigationControl({
      visualizePitch: true
    })
    map.addControl(nav, 'top-left')
  }, [lat, lng, mapReady, zoom])

  return <div className='h-full w-full' ref={() => setMapReady(true)} id='central-map' />
}
