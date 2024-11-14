/* eslint-disable i18next/no-literal-string */

/* eslint-disable react-hooks/exhaustive-deps */
import { LayersIcon } from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'
import * as Tooltip from '@radix-ui/react-tooltip'
import { Map as MapLibreMap, NavigationControl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useTheme } from 'next-themes'
import { FC, useEffect, useRef, useState } from 'react'

import { JetColorTable } from './rsrptable'
import { RsrpColorTable } from './rsrptable'

export const Map: FC = () => {
  const [lng] = useState(82.9296)
  const [lat] = useState(55.0152)
  const [zoom] = useState(13)
  const [selectedLayer, setSelectLayer] = useState(0)

  const map = useRef<MapLibreMap | null>(null)
  const mapContainer = useRef(null)

  const { theme } = useTheme()
  const mapStyle = theme === 'dark' ? 'streets-dark' : 'streets'

  const handleLayerVisibility = () => {
    if (!map.current) return
    map.current.setLayoutProperty(
      'tiles-jet-layer',
      'visibility',
      selectedLayer === 1 ? 'visible' : 'none'
    )
    map.current.setLayoutProperty(
      'tiles-magma-layer',
      'visibility',
      selectedLayer === 2 ? 'visible' : 'none'
    )
    map.current.setLayoutProperty(
      'rsrq-tiles-jet-layer',
      'visibility',
      selectedLayer === 3 ? 'visible' : 'none'
    )
    map.current.setLayoutProperty(
      'rsrq-tiles-magma-layer',
      'visibility',
      selectedLayer === 4 ? 'visible' : 'none'
    )
  }

  useEffect(() => {
    if (!mapContainer.current) return

    if (map.current) {
      map.current.remove()
      map.current = null
    }

    map.current = new MapLibreMap({
      container: mapContainer.current,
      center: [lng, lat],
      zoom: zoom,
      style: `https://api.maptiler.com/maps/${mapStyle}/style.json?key=${import.meta.env.VITE_MAPLIBRE_API_KEY}`
    })

    map.current.on('load', () => {
      if (map.current) {
        map.current.addSource('tiles-jet', {
          type: 'raster',
          tiles: [`${import.meta.env.VITE_API_TILES}/tiles/rsrp/jet/{z}/{x}/{y}`],
          tileSize: 256
        })
        map.current.addLayer({
          id: 'tiles-jet-layer',
          type: 'raster',
          source: 'tiles-jet',
          minzoom: 8,
          maxzoom: 20,
          layout: { visibility: 'none' }
        })

        map.current.addSource('tiles-magma', {
          type: 'raster',
          tiles: [`${import.meta.env.VITE_API_TILES}/tiles/rsrp/magma/{z}/{x}/{y}`],
          tileSize: 256
        })
        map.current.addLayer({
          id: 'tiles-magma-layer',
          type: 'raster',
          source: 'tiles-magma',
          minzoom: 8,
          maxzoom: 20,
          layout: { visibility: 'none' }
        })

        map.current.addSource('rsrq-tiles-jet', {
          type: 'raster',
          tiles: [`${import.meta.env.VITE_API_TILES}/tiles/rsrq/jet/{z}/{x}/{y}`],
          tileSize: 256
        })
        map.current.addLayer({
          id: 'rsrq-tiles-jet-layer',
          type: 'raster',
          source: 'rsrq-tiles-jet',
          minzoom: 8,
          maxzoom: 20,
          layout: { visibility: 'none' }
        })

        map.current.addSource('rsrq-tiles-magma', {
          type: 'raster',
          tiles: [`${import.meta.env.VITE_API_TILES}/tiles/rsrq/magma/{z}/{x}/{y}`],
          tileSize: 256
        })
        map.current.addLayer({
          id: 'rsrq-tiles-magma-layer',
          type: 'raster',
          source: 'rsrq-tiles-magma',
          minzoom: 8,
          maxzoom: 20,
          layout: { visibility: 'none' }
        })

        const nav = new NavigationControl({ visualizePitch: true })
        map.current.addControl(nav, 'top-left')
        handleLayerVisibility()
      }
    })
  }, [lat, lng, mapStyle, zoom, theme])

  const handleLayerChange = (layer: number) => {
    setSelectLayer(layer)
    if (!map.current) return

    map.current.setLayoutProperty('tiles-jet-layer', 'visibility', layer === 1 ? 'visible' : 'none')
    map.current.setLayoutProperty(
      'tiles-magma-layer',
      'visibility',
      layer === 2 ? 'visible' : 'none'
    )
    map.current.setLayoutProperty(
      'rsrq-tiles-jet-layer',
      'visibility',
      layer === 3 ? 'visible' : 'none'
    )
    map.current.setLayoutProperty(
      'rsrq-tiles-magma-layer',
      'visibility',
      layer === 4 ? 'visible' : 'none'
    )
  }

  return (
    <div className='relative h-full w-full'>
      <Popover.Root>
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Popover.Trigger asChild>
                <button className='absolute left-0 top-28 z-10'>
                  <LayersIcon className='h-[50px] w-[50px]' />
                </button>
              </Popover.Trigger>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className='rounded bg-black px-2 py-1 text-sm text-white'
                side='right'
                sideOffset={5}
              >
                Слои карты
                <Tooltip.Arrow className='fill-black' />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
        <Popover.Portal>
          <Popover.Content
            className='PopoverContent bg-tertiary'
            side='right'
            sideOffset={20}
            style={{ zIndex: 9999 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p className='Text' style={{ marginBottom: 10 }}>
                Слои карты
              </p>
              <fieldset className='Fieldset'>
                <label>
                  <input
                    type='radio'
                    name='mapLayer'
                    checked={selectedLayer === 0}
                    onChange={() => handleLayerChange(0)}
                  />
                  Пустая карта
                </label>
              </fieldset>
              <fieldset className='Fieldset'>
                <label>
                  <input
                    type='radio'
                    name='mapLayer'
                    checked={selectedLayer === 1}
                    onChange={() => handleLayerChange(1)}
                  />
                  Значения RSRP - jet
                </label>
              </fieldset>
              <fieldset className='Fieldset'>
                <label>
                  <input
                    type='radio'
                    name='mapLayer'
                    checked={selectedLayer === 2}
                    onChange={() => handleLayerChange(2)}
                  />
                  Значения RSRP - magma
                </label>
              </fieldset>
              <fieldset className='Fieldset'>
                <label>
                  <input
                    type='radio'
                    name='mapLayer'
                    checked={selectedLayer === 3}
                    onChange={() => handleLayerChange(3)}
                  />
                  Значения RSRQ - jet
                </label>
              </fieldset>
              <fieldset className='Fieldset'>
                <label>
                  <input
                    type='radio'
                    name='mapLayer'
                    checked={selectedLayer === 4}
                    onChange={() => handleLayerChange(4)}
                  />
                  Значения RSRQ - magma
                </label>
              </fieldset>
            </div>
            <Popover.Close className='PopoverClose' aria-label='Close'></Popover.Close>
            <Popover.Arrow className='PopoverArrow' />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {selectedLayer === 1 && (
        <Popover.Root>
          <JetColorTable />
          <Popover.Portal>
            <Popover.Content
              className='PopoverContent'
              side='top'
              sideOffset={10}
              style={{ zIndex: 9999 }}
            >
              <Popover.Arrow className='PopoverArrow' />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )}

      {selectedLayer === 2 && (
        <Popover.Root>
          <RsrpColorTable />
          <Popover.Portal>
            <Popover.Content
              className='PopoverContent'
              side='top'
              sideOffset={10}
              style={{ zIndex: 9999 }}
            >
              <Popover.Arrow className='PopoverArrow' />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )}

      <div ref={mapContainer} className='h-full w-full' />
    </div>
  )
}
