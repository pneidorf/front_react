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
  const [isPanelVisible, setIsPanelVisible] = useState(false) // Управление видимостью панели

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
      const response = await fetch('/markers.json') // Путь к вашему JSON
      const data = await response.json()

      setRawData(data) // Сохраняем все данные
      setMarkersData(data)
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
      const rsrp = parseFloat(marker.rsrp)
      const rsrq = parseFloat(marker.rsrq)
      const markerOperator = marker.operator?.toLowerCase() // Приводим оператора к нижнему регистру для сравнения

      const withinRSRP = rsrp >= inputRange.rsrp[0] && rsrp <= inputRange.rsrp[1]
      const withinRSRQ = rsrq >= inputRange.rsrq[0] && rsrq <= inputRange.rsrq[1]
      const operatorMatch = operator === 'all' || operator === markerOperator

      if (selectedLayer === 1) {
        return withinRSRP && operatorMatch
      }
      if (selectedLayer === 2) {
        return withinRSRQ && operatorMatch
      }
      return false // Для других слоев ничего не фильтруется
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
  const handleOperatorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOperator(event.target.value) // Обновляем состояние оператора
  }

  return (
    <div className='relative h-full w-full'>
      <button
        className='absolute left-4 top-4 z-10 rounded-full bg-blue-500 p-3 text-white shadow-lg hover:bg-blue-600'
        onClick={() => setIsPanelVisible(!isPanelVisible)}
      >
        {isPanelVisible ? 'Закрыть' : 'Фильтры'}
      </button>

      {isPanelVisible && (
        <div className='absolute left-4 top-20 z-10 w-80 rounded-lg bg-white p-4 shadow-lg transition-transform duration-300'>
          <label htmlFor='operator-select' className='mb-2 block font-medium text-gray-700'>
            Оператор:
          </label>
          <select
            id='operator-select'
            value={operator}
            onChange={handleOperatorChange}
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          >
            <option value='all'>Все операторы</option>
            <option value='yota'>Yota</option>
            <option value='beeline'>Beeline</option>
            <option value='mts'>MTS</option>
            <option value='megafon'>Megafon</option>
          </select>

          <div className='mt-4'>
            <label htmlFor='layer-select' className='mb-2 block font-medium text-gray-700'>
              Выбор бэнда:
            </label>
            <select
              id='layer-select'
              // value={selectedLayer}
              // onChange={handleLayerChange}
              className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            >
              <option value={0}>Выберите band</option>
            </select>
          </div>

          <div className='mt-4'>
            <label htmlFor='layer-select' className='mb-2 block font-medium text-gray-700'>
              Выбор слоя:
            </label>
            <select
              id='layer-select'
              value={selectedLayer}
              onChange={handleLayerChange}
              className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            >
              <option value={0}>Выберите слой</option>
              <option value={1}>RSRP</option>
              <option value={2}>RSRQ</option>
            </select>
          </div>

          {selectedLayer === 1 && (
            <div className='mt-4'>
              <label className='block font-medium text-gray-700'>Диапазон RSRP:</label>
              <div className='mt-2 flex items-center justify-between'>
                <input
                  type='number'
                  value={inputRange.rsrp[0]}
                  onChange={e => handleInputChange('rsrp', 0, e.target.value)}
                  className='w-24 rounded-md border-gray-300 text-center shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
                <span className='mx-2'>-</span>
                <input
                  type='number'
                  value={inputRange.rsrp[1]}
                  onChange={e => handleInputChange('rsrp', 1, e.target.value)}
                  className='w-24 rounded-md border-gray-300 text-center shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
            </div>
          )}

          {selectedLayer === 2 && (
            <div className='mt-4'>
              <label className='block font-medium text-gray-700'>Диапазон RSRQ:</label>
              <div className='mt-2 flex items-center justify-between'>
                <input
                  type='number'
                  value={inputRange.rsrq[0]}
                  onChange={e => handleInputChange('rsrq', 0, e.target.value)}
                  className='w-24 rounded-md border-gray-300 text-center shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
                <span className='mx-2'>-</span>
                <input
                  type='number'
                  value={inputRange.rsrq[1]}
                  onChange={e => handleInputChange('rsrq', 1, e.target.value)}
                  className='w-24 rounded-md border-gray-300 text-center shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
            </div>
          )}

          <div className='mt-6 flex justify-between'>
            <button
              onClick={handleReset}
              className='w-[48%] rounded-md bg-gray-300 py-2 text-gray-800 shadow-md hover:bg-gray-400'
            >
              Сброс
            </button>
            <button
              onClick={applyFilters}
              className='w-[48%] rounded-md bg-blue-500 py-2 text-white shadow-md hover:bg-blue-600'
            >
              Применить
            </button>
          </div>
        </div>
      )}

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
