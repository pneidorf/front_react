import { ScatterplotLayer } from '@deck.gl/layers'
import DeckGL from '@deck.gl/react'
import { useTheme } from 'next-themes'
import React, { useEffect, useMemo, useState } from 'react'
import { Map as MapLibreMap, NavigationControl } from 'react-map-gl/maplibre'

import { api } from '~/shared/api'

const MS_PER_DAY = 8.64e7 // миллисекунды в одном дне

export const MapDeck: React.FC = () => {
  const [viewState] = useState({
    longitude: 82.9296,
    latitude: 55.0152,
    zoom: 13,
    pitch: 0,
    bearing: 0
  })
  const [rawData, setRawData] = useState<any[]>([])
  const [selectedLayer, setSelectedLayer] = useState(0)
  const [operator, setOperator] = useState('all')
  const [markersData, setMarkersData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)
  const [filterValue, setFilterValue] = useState<[number, number] | null>(null)
  const [inputRange, setInputRange] = useState({
    rsrp: [-120, -60],
    rsrq: [-30, -5]
  })
  const [filterRange, setFilterRange] = useState({
    rsrp: [-120, -60],
    rsrq: [-30, -5]
  })
  const { theme } = useTheme()
  const mapStyle = theme === 'dark' ? 'streets-dark' : 'streets'
  const mapstyle = `https://api.maptiler.com/maps/${mapStyle}/style.json?key=${import.meta.env.VITE_MAPLIBRE_API_KEY}`

  const getTimeRange = useMemo(() => {
    const start = new Date('2024-01-01T00:00:00.000Z').getTime()
    const end = new Date().getTime()
    return [start, end]
  }, [])

  useEffect(() => {
    setFilterValue(getTimeRange)
  }, [getTimeRange])

  const fetchMarkers = async (timeStart: string, timeEnd: string) => {
    try {
      setIsLoading(true)
      const data = await api.getRSRPQuality(timeStart, timeEnd)
      const processedData = data
        .map(item => {
          const wcdma = item.wcdma.find(w => w.registered)
          return {
            lon: item.longitude,
            lat: item.latitude,
            rsrp: wcdma ? wcdma.rscp : null,
            rsrq: wcdma ? wcdma.ecno : null
          }
        })
        .filter(item => item.rsrp !== null && item.rsrq !== null)
      setRawData(processedData)
      setMarkersData(processedData)
      setIsLoading(false)
    } catch (err) {
      setError('Error loading markers')
      setIsLoading(false)
    }
  }

  const layers = [
    selectedLayer === 1 &&
      markersData &&
      new ScatterplotLayer({
        id: 'rsrp-layer',
        data: markersData,
        pickable: true,
        opacity: 0.3,
        stroked: false,
        filled: true,
        radiusScale: 100,
        radiusMinPixels: 2,
        radiusMaxPixels: 2,
        getPosition: d => [parseFloat(d.lon), parseFloat(d.lat)],
        getFillColor: d => {
          const rsrp = d.rsrp
          if (rsrp > -85) return [0, 200, 0]
          if (rsrp > -95) return [255, 165, 0]
          return [200, 0, 0]
        }
      }),
    selectedLayer === 2 &&
      markersData &&
      new ScatterplotLayer({
        id: 'rsrq-layer',
        data: markersData,
        pickable: true,
        opacity: 0.3,
        stroked: false,
        filled: true,
        radiusScale: 100,
        radiusMinPixels: 2,
        radiusMaxPixels: 2,
        getPosition: d => [parseFloat(d.lon), parseFloat(d.lat)],
        getFillColor: d => {
          const rsrq = d.rsrq
          if (rsrq > -10) return [0, 200, 0]
          if (rsrq > -20) return [255, 165, 0]
          return [200, 0, 0]
        }
      })
  ]

  const handleInputChange = (type: 'rsrp' | 'rsrq', index: number, value: string) => {
    setInputRange(prev => {
      const updated = { ...prev }
      updated[type][index] = parseInt(value)
      return updated
    })
  }

  const applyFilters = () => {
    setFilterRange(inputRange) // Синхронизация filterRange с inputRange
    const filteredData = rawData.filter(marker => {
      const withinRSRP = marker.rsrp >= inputRange.rsrp[0] && marker.rsrp <= inputRange.rsrp[1]
      const withinRSRQ = marker.rsrq >= inputRange.rsrq[0] && marker.rsrq <= inputRange.rsrq[1]

      if (selectedLayer === 1) {
        return withinRSRP
      }
      if (selectedLayer === 2) {
        return withinRSRQ
      }
      return false
    })
    setMarkersData(filteredData)
  }

  const handleSliderChange = (newValue: [number, number]) => {
    setFilterValue(newValue)
  }

  const handleLayerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const layer = parseInt(event.target.value, 10)
    setSelectedLayer(layer)
  }

  const handleReset = () => {
    setFilterValue(getTimeRange)
    setSelectedLayer(0)
    setOperator('all')
  }

  const handleShow = () => {
    if (filterValue) {
      const [start, end] = filterValue
      fetchMarkers(new Date(start).toISOString(), new Date(end).toISOString())
    }
  }

  return (
    <div className='relative h-full w-full'>
      <div className='absolute right-4 top-4 z-10 w-64 rounded bg-tertiary p-2 shadow'>
        <label htmlFor='operator-select'>Оператор:</label>
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

      <div className='absolute right-4 top-16 z-10 flex h-[11.5rem] w-64 flex-col rounded bg-tertiary p-2 shadow'>
        <div className='flex flex-row'>
          <label htmlFor='layer-select'>Выбор слоя:</label>
          <select
            id='layer-select'
            value={selectedLayer}
            onChange={handleLayerChange}
            className='ml-2 bg-tertiary'
          >
            <option value={0}>Выберите слой</option>
            <option value={1}>RSRP</option>
            <option value={2}>RSRQ</option>
          </select>
        </div>
        <div className='grid grid-cols-1 grid-rows-5'>
          <div className='row-start-1 flex h-min justify-center'>
            <label>Диапазон RSRP:</label>
          </div>
          <div className='row-start-2 flex h-min justify-center'>
            <input
              type='number'
              value={inputRange.rsrp[0]}
              onChange={e => handleInputChange('rsrp', 0, e.target.value)}
              className='mr-5 max-w-16 rounded pl-2'
            />
            <input
              type='number'
              value={inputRange.rsrp[1]}
              onChange={e => handleInputChange('rsrp', 1, e.target.value)}
              className='ml-5 max-w-16 rounded pl-2'
            />
          </div>
          <div className='row-start-3 flex h-min justify-center'>
            <label>Диапазон RSRQ:</label>
          </div>
          <div className='row-start-4 flex h-min justify-center'>
            <input
              type='number'
              value={inputRange.rsrq[0]}
              onChange={e => handleInputChange('rsrq', 0, e.target.value)}
              className='mr-5 max-w-16 rounded pl-2'
            />
            <input
              type='number'
              value={inputRange.rsrq[1]}
              onChange={e => handleInputChange('rsrq', 1, e.target.value)}
              className='ml-5 max-w-16 rounded pl-2'
            />
          </div>
        </div>
        <div className='flex justify-center'>
          <button
            onClick={applyFilters}
            // eslint-disable-next-line max-len
            className='mt-[-0.5rem] h-8 w-44 rounded border-2 border-neutral-400 bg-gray-200 transition-transform hover:scale-[1.02] hover:border-[#8197F7] hover:bg-gray-300 hover:shadow-md focus:bg-[#8197F7] focus:shadow-sky-200'
          >
            Применить
          </button>
        </div>
      </div>

      <div className='absolute right-4 top-64 z-10'>
        <button onClick={handleReset} className='rounded bg-red-500 p-2 text-white shadow'>
          Сброс
        </button>
      </div>

      <DeckGL
        initialViewState={viewState}
        controller={true}
        layers={layers}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      >
        <MapLibreMap mapStyle={mapstyle}>
          <NavigationControl position='top-left' />
        </MapLibreMap>
      </DeckGL>

      <div className='z-9999 absolute bottom-10 left-[40rem] w-[40rem]'>
        <div className='flex w-full justify-between'>
          <span>
            {new Date(filterValue ? filterValue[0] : getTimeRange[0]).toLocaleDateString()}
          </span>
          <span>
            {new Date(filterValue ? filterValue[1] : getTimeRange[1]).toLocaleDateString()}
          </span>
        </div>

        <input
          type='range'
          min={getTimeRange[0]}
          max={getTimeRange[1]}
          step={MS_PER_DAY}
          value={filterValue ? filterValue[0] : getTimeRange[0]}
          onChange={e =>
            handleSliderChange([
              parseInt(e.target.value),
              filterValue ? filterValue[1] : getTimeRange[1]
            ])
          }
          className='w-full'
        />

        <input
          type='range'
          min={getTimeRange[0]}
          max={getTimeRange[1]}
          step={MS_PER_DAY}
          value={filterValue ? filterValue[1] : getTimeRange[1]}
          onChange={e =>
            handleSliderChange([
              filterValue ? filterValue[0] : getTimeRange[0],
              parseInt(e.target.value)
            ])
          }
          className='w-full'
        />

        <button onClick={handleShow} className='mt-4 bg-blue-500 p-2 text-white'>
          Показать
        </button>
      </div>
    </div>
  )
}
