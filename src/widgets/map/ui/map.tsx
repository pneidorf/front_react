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
import { RSRQJetTable } from './rsrptable'
import { RSRQMagmaTable } from './rsrptable'

export const Map: FC = () => {
  const [lng] = useState(82.9296)
  const [lat] = useState(55.0152)
  const [zoom] = useState(13)
  const [selectedLayer, setSelectLayer] = useState(0)
  const [operator, setOperator] = useState('all') // Новое состояние для оператора

  const map = useRef<MapLibreMap | null>(null)
  const mapContainer = useRef(null)

  const { theme } = useTheme()
  const mapStyle = theme === 'dark' ? 'streets-dark' : 'streets'

  const getTileUrl = (metric: string, style: string) =>
    `${import.meta.env.VITE_API_TILES}/tiles/${operator}/${metric}/${style}/{z}/{x}/{y}`

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
    // map.current.setLayoutProperty(
    //   'pci-tiles-jet-layer',
    //   'visibility',
    //   selectedLayer === 5 ? 'visible' : 'none'
    // )
    // map.current.setLayoutProperty(
    //   'pci-tiles-magma-layer',
    //   'visibility',
    //   selectedLayer === 6 ? 'visible' : 'none'
    // )
    // map.current.setLayoutProperty(
    //   'pci-mod-3-tiles-jet-layer',
    //   'visibility',
    //   selectedLayer === 7 ? 'visible' : 'none'
    // )
    // map.current.setLayoutProperty(
    //   'pci-mod-3-tiles-magma-layer',
    //   'visibility',
    //   selectedLayer === 8 ? 'visible' : 'none'
    // )
    // map.current.setLayoutProperty(
    //   'pci-mod-6-tiles-jet-layer',
    //   'visibility',
    //   selectedLayer === 9 ? 'visible' : 'none'
    // )
    // map.current.setLayoutProperty(
    //   'pci-mod-6-tiles-magma-layer',
    //   'visibility',
    //   selectedLayer === 10 ? 'visible' : 'none'
    // )
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
          tiles: [getTileUrl('rsrp', 'jet')],
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
          tiles: [getTileUrl('rsrp', 'magma')],
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
          tiles: [getTileUrl('rsrq', 'jet')],
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
          tiles: [getTileUrl('rsrq', 'magma')],
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

        // map.current.addSource('pci-tiles-jet', {
        //   type: 'raster',
        //   tiles: [getTileUrl('pci', 'jet')],
        //   tileSize: 256
        // })
        // map.current.addLayer({
        //   id: 'pci-tiles-jet-layer',
        //   type: 'raster',
        //   source: 'pci-tiles-jet',
        //   minzoom: 8,
        //   maxzoom: 20,
        //   layout: { visibility: 'none' }
        // })

        // map.current.addSource('pci-tiles-magma', {
        //   type: 'raster',
        //   tiles: [getTileUrl('pci', 'magma')],
        //   tileSize: 256
        // })
        // map.current.addLayer({
        //   id: 'pci-tiles-magma-layer',
        //   type: 'raster',
        //   source: 'pci-tiles-magma',
        //   minzoom: 8,
        //   maxzoom: 20,
        //   layout: { visibility: 'none' }
        // })

        // // PCI % 3
        // map.current.addSource('pci-mod-3-tiles-jet', {
        //   type: 'raster',
        //   tiles: [getTileUrl('pci_mod_3', 'jet')],
        //   tileSize: 256
        // })
        // map.current.addLayer({
        //   id: 'pci-mod-3-tiles-jet-layer',
        //   type: 'raster',
        //   source: 'pci-mod-3-tiles-jet',
        //   minzoom: 8,
        //   maxzoom: 20,
        //   layout: { visibility: 'none' }
        // })

        // map.current.addSource('pci-mod-3-tiles-magma', {
        //   type: 'raster',
        //   tiles: [getTileUrl('pci_mod_3', 'magma')],
        //   tileSize: 256
        // })
        // map.current.addLayer({
        //   id: 'pci-mod-3-tiles-magma-layer',
        //   type: 'raster',
        //   source: 'pci-mod-3-tiles-magma',
        //   minzoom: 8,
        //   maxzoom: 20,
        //   layout: { visibility: 'none' }
        // })

        // // PCI % 6
        // map.current.addSource('pci-mod-6-tiles-jet', {
        //   type: 'raster',
        //   tiles: [getTileUrl('pci_mod_6', 'jet')],
        //   tileSize: 256
        // })
        // map.current.addLayer({
        //   id: 'pci-mod-6-tiles-jet-layer',
        //   type: 'raster',
        //   source: 'pci-mod-6-tiles-jet',
        //   minzoom: 8,
        //   maxzoom: 20,
        //   layout: { visibility: 'none' }
        // })

        // map.current.addSource('pci-mod-6-tiles-magma', {
        //   type: 'raster',
        //   tiles: [getTileUrl('pci_mod_6', 'magma')],
        //   tileSize: 256
        // })
        // map.current.addLayer({
        //   id: 'pci-mod-6-tiles-magma-layer',
        //   type: 'raster',
        //   source: 'pci-mod-6-tiles-magma',
        //   minzoom: 8,
        //   maxzoom: 20,
        //   layout: { visibility: 'none' }
        // })

        const nav = new NavigationControl({ visualizePitch: true })
        map.current.addControl(nav, 'top-left')
        handleLayerVisibility()
      }
    })
  }, [lat, lng, mapStyle, zoom, theme, operator])

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
    // map.current.setLayoutProperty(
    //   'pci-tiles-jet-layer',
    //   'visibility',
    //   selectedLayer === 5 ? 'visible' : 'none'
    // )
    // map.current.setLayoutProperty(
    //   'pci-tiles-magma-layer',
    //   'visibility',
    //   selectedLayer === 6 ? 'visible' : 'none'
    // )
    // map.current.setLayoutProperty(
    //   'pci-mod-3-tiles-jet-layer',
    //   'visibility',
    //   selectedLayer === 7 ? 'visible' : 'none'
    // )
    // map.current.setLayoutProperty(
    //   'pci-mod-3-tiles-magma-layer',
    //   'visibility',
    //   selectedLayer === 8 ? 'visible' : 'none'
    // )
    // map.current.setLayoutProperty(
    //   'pci-mod-6-tiles-jet-layer',
    //   'visibility',
    //   selectedLayer === 9 ? 'visible' : 'none'
    // )
    // map.current.setLayoutProperty(
    //   'pci-mod-6-tiles-magma-layer',
    //   'visibility',
    //   selectedLayer === 10 ? 'visible' : 'none'
    // )
  }

  return (
    <div className='relative h-full w-full'>
      <div className='absolute right-4 top-4 z-10 rounded bg-tertiary p-2 shadow'>
        <label htmlFor='operator-select bg-tertiary'>Оператор:</label>
        <select
          id='operator-select'
          value={operator}
          onChange={e => setOperator(e.target.value)}
          className='ml-2 bg-tertiary'
        >
          <option value='all'>Все операторы</option>
          <option value='yota'>Yota</option>
          <option value='beeline'>Beeline</option>
        </select>
      </div>
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
              {/* <fieldset className='Fieldset'>
                <label>
                  <input
                    type='radio'
                    name='mapLayer'
                    checked={selectedLayer === 5}
                    onChange={() => handleLayerChange(5)}
                  />
                  Значения PCI - jet
                </label>
              </fieldset>
              <fieldset className='Fieldset'>
                <label>
                  <input
                    type='radio'
                    name='mapLayer'
                    checked={selectedLayer === 6}
                    onChange={() => handleLayerChange(6)}
                  />
                  Значения PCI - magma
                </label>
              </fieldset>
              <fieldset className='Fieldset'>
                <label>
                  <input
                    type='radio'
                    name='mapLayer'
                    checked={selectedLayer === 7}
                    onChange={() => handleLayerChange(7)}
                  />
                  Значения PCI % 3 - jet
                </label>
              </fieldset>
              <fieldset className='Fieldset'>
                <label>
                  <input
                    type='radio'
                    name='mapLayer'
                    checked={selectedLayer === 8}
                    onChange={() => handleLayerChange(8)}
                  />
                  Значения PCI % 3 - magma
                </label>
              </fieldset>
              <fieldset className='Fieldset'>
                <label>
                  <input
                    type='radio'
                    name='mapLayer'
                    checked={selectedLayer === 9}
                    onChange={() => handleLayerChange(9)}
                  />
                  Значения PCI % 6 - jet
                </label>
              </fieldset>
              <fieldset className='Fieldset'>
                <label>
                  <input
                    type='radio'
                    name='mapLayer'
                    checked={selectedLayer === 10}
                    onChange={() => handleLayerChange(10)}
                  />
                  Значения PCI % 6 - magma
                </label>
              </fieldset> */}
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
      {selectedLayer === 3 && (
        <Popover.Root>
          <RSRQJetTable />
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

      {selectedLayer === 4 && (
        <Popover.Root>
          <RSRQMagmaTable />
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
