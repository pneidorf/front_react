import { ArcLayer, IconLayer, LineLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers'
import DeckGL from '@deck.gl/react'
import chroma from 'chroma-js'
import { useTheme } from 'next-themes'
import React, { useEffect, useMemo, useState } from 'react'
import { Map as MapLibreMap, NavigationControl } from 'react-map-gl/maplibre'

import { JetColorTable, RSRQJetTable } from './rsrptable'
import { api } from '~/shared/api'

const MS_PER_DAY = 8.64e7 // миллисекунды в одном дне

interface Lte {
  ID: number
  RequestID: number
  type: string
  registered: boolean
  mcc: number
  mnc: number
  ci: number
  pci: number
  tac: number
  earfcn: number
  bandwidth: number
  rsrp: number
  rssi: number
  rsrq: number
  rssnr: number
  cqi: number
  timingAdvance: number
  ishandover: boolean
  ispcicoll: boolean
  isearfcncoll: boolean
}

interface Handover {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: string | null
  jwt: string
  UUID: string
  time: string
  latitude: number
  longitude: number
  operator: string
  wcdma: any
  gsm: any
  lte: Lte[]
  nr: any
}

interface ThermalMapDataPoint {
  lte: Lte[]
}

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
  const [selectedHandover, setSelectedHandover] = useState<any>(null)
  const [showArrows, setShowArrows] = useState<any>(null)
  const [showArcs, setShowArcs] = useState<any>(null)
  const [showIcons, setShowIcons] = useState<any>(null)
  const [handoversData, setHandoversData] = useState<any[]>([])
  const [filterValue, setFilterValue] = useState<[number, number] | null>(null)
  const [inputRange, setInputRange] = useState({
    rsrp: [-120, -60],
    rsrq: [-30, -5]
  })
  const [filterRange, setFilterRange] = useState({
    rsrp: [-120, -60],
    rsrq: [-30, -5]
  })
  const [isPanelVisible, setIsPanelVisible] = useState(false)
  const [showProblemAreas, setShowProblemAreas] = useState(false)
  const [showHandover, setShowHandover] = useState(false)
  const [showCollisionThree, setShowCollisionThree] = useState(false)
  const [showCollisionSix, setShowCollisionSix] = useState(false)
  const [collisionThreeData, setCollisionThreeData] = useState<any[]>([])
  const [collisionSixData, setCollisionSixData] = useState<any[]>([])

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

  const getUniqueColor = index => chroma.hsv((index * 360) / handoversData.length, 0.7, 0.8).rgb()

  const fetchMarkers = async () => {
    try {
      setIsLoading(true)
      const data2 = (await api.getThermalMapDataPoint(
        55.0,
        82.0,
        56.0,
        83.0
      )) as ThermalMapDataPoint[]
      const handovers = (await api.getThermalMapDataHandover(
        55.0,
        82.0,
        56.0,
        83.0
      )) as Handover[][]

      const processedHandovers = handovers.map((pair: Handover[]) => ({
        from: pair[0],
        to: pair[1]
      }))
      const CollisionThree = await api.getCollisionThree(55.0, 82.0, 56.0, 83.0)
      setCollisionThreeData(CollisionThree)
      setShowCollisionThree(false)

      const CollisionSix = await api.getCollisionSix(55.0, 82.0, 56.0, 83.0)
      setCollisionSixData(CollisionSix)
      setShowCollisionSix(false)

      setHandoversData(processedHandovers)
      console.log('handovers')
      console.log(handovers)

      const filteredData = data2.filter(
        (item: ThermalMapDataPoint) =>
          item && item.lte && Array.isArray(item.lte) && item.lte.length > 0
      )

      setRawData(filteredData)
      setMarkersData(filteredData)
      setIsLoading(false)
    } catch (err) {
      setError('Error loading markers')
      setIsLoading(false)
    }
  }

  // const fetchCollisionThree = async () => {
  //   try {
  //     const data = await api.getCollisionThree(55.0, 82.0, 56.0, 83.0)
  //     setCollisionThreeData(data)
  //     setShowCollisionThree(true)
  //   } catch (err) {
  //     console.error('Error fetching collision three data:', err)
  //   }
  // }

  // const fetchCollisionSix = async () => {
  //   try {
  //     const data = await api.getCollisionSix(55.0, 82.0, 56.0, 83.0)
  //     setCollisionSixData(data)
  //     setShowCollisionSix(true)
  //   } catch (err) {
  //     console.error('Error fetching collision six data:', err)
  //   }
  // }

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
        getPosition: d => [parseFloat(d.longitude), parseFloat(d.latitude)],
        getFillColor: d => {
          if (!d.lte || !Array.isArray(d.lte) || d.lte.length === 0) {
            return [0, 0, 0]
          }
          const rsrp = d.lte[0].rsrp

          if (rsrp >= -70) return [255, 70, 0]
          if (rsrp >= -80) return [255, 229, 0]
          if (rsrp >= -90) return [124, 255, 121]
          if (rsrp >= -100) return [54, 255, 192]
          if (rsrp >= -110) return [0, 76, 255]
          return [0, 0, 127]
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
        getPosition: d => [parseFloat(d.longitude), parseFloat(d.latitude)],
        getFillColor: d => {
          if (!d.lte || !Array.isArray(d.lte) || d.lte.length === 0) {
            return [200, 0, 0]
          }
          const rsrq = d.lte[0].rsrq

          if (rsrq >= -5) return [255, 63, 0]
          if (rsrq >= -10) return [255, 211, 0]
          if (rsrq >= -15) return [15, 248, 231]
          return [0, 0, 127]
        }
      }),
    showProblemAreas &&
      new ScatterplotLayer({
        id: 'problem-areas-layer',
        data: markersData.filter(d => {
          const rsrp = d.lte[0]?.rsrp
          const rsrq = d.lte[0]?.rsrq
          return (selectedLayer === 1 && rsrp < -100) || (selectedLayer === 2 && rsrq < -20)
        }),
        pickable: true,
        opacity: 0.5,
        stroked: true,
        filled: true,
        radiusScale: 100,
        radiusMinPixels: 10,
        radiusMaxPixels: 10,
        getPosition: d => [parseFloat(d.longitude), parseFloat(d.latitude)],
        getFillColor: d => {
          const rsrp = d.lte[0]?.rsrp
          const rsrq = d.lte[0]?.rsrq
          if (selectedLayer === 1 && rsrp < -100) {
            return [255, 0, 0, 128] // Красный с прозрачностью
          }
          if (selectedLayer === 2 && rsrq < -20) {
            return [0, 0, 255, 128] // Синий с прозрачностью
          }
          return [0, 0, 0]
        },
        getLineColor: d => {
          const rsrp = d.lte[0]?.rsrp
          const rsrq = d.lte[0]?.rsrq
          if (selectedLayer === 1 && rsrp < -100) {
            return [255, 0, 0] // Красный
          }
          if (selectedLayer === 2 && rsrq < -20) {
            return [0, 0, 255] // Синий
          }
          return [0, 0, 0]
        },
        lineWidthMinPixels: 2
      }),
    showHandover &&
      new LineLayer({
        id: 'handovers-layer',
        data: handoversData,
        getSourcePosition: d => [d.from.longitude, d.from.latitude],
        getTargetPosition: d => [d.to.longitude, d.to.latitude],
        getColor: [147, 112, 219, 200],
        getWidth: 3,
        pickable: true,
        arrowHead: {
          type: 'triangle',
          size: 15, // Размер наконечника в пикселях
          length: 0.3, // Доля от длины линии (30%)
          filled: true
        },
        onClick: ({ object }) => setSelectedHandover(object)
      }),
    showHandover &&
      showArcs &&
      new ArcLayer({
        id: 'handovers-arcs-layer',
        data: handoversData,
        getSourcePosition: d => [d.from.longitude, d.from.latitude],
        getTargetPosition: d => [d.to.longitude, d.to.latitude],
        getSourceColor: [0, 128, 255], // Синий для начала дуги
        getTargetColor: [255, 0, 128], // Розовый для конца дуги
        getWidth: 2,
        getHeight: 0.2, // Высота дуги в градусах
        pickable: true,
        greatCircle: false, // Дуга по большому кругу
        onClick: ({ object }) => setSelectedHandover(object)
      }),
    showHandover &&
      showArrows &&
      new IconLayer({
        id: 'handovers-start-points-layer',
        data: handoversData,
        getPosition: d => [d.from.longitude, d.from.latitude],
        getIcon: () => ({
          url: `data:image/svg+xml;utf8,${encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="blue" width="24" height="24"><circle cx="12" cy="12" r="6"/></svg>'
          )}`,
          width: 24,
          height: 24,
          anchorY: 12
        }),
        getSize: 20,
        pickable: true,
        onClick: ({ object }) => setSelectedHandover(object)
      }),
    showHandover &&
      showArrows &&
      new IconLayer({
        id: 'handovers-icons-layer',
        data: handoversData,
        getPosition: d => [d.to.longitude, d.to.latitude],
        getIcon: () => ({
          url: `data:image/svg+xml;utf8,${encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="24" height="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
          )}`,
          width: 24,
          height: 24,
          anchorY: 12
        }),
        getSize: 20,
        pickable: true,
        onClick: ({ object }) => setSelectedHandover(object)
      }),
    showHandover &&
      showIcons &&
      new TextLayer({
        id: 'handovers-text-layer',
        data: handoversData,
        getPosition: d => [
          (d.from.longitude + d.to.longitude) / 2,
          (d.from.latitude + d.to.latitude) / 2
        ], // Центр линии
        getText: d => `${d.from.lte[0].pci} to ${d.to.lte[0].pci}`,
        getColor: [255, 255, 255, 200], // Белый текст
        getSize: 14,
        background: true,
        backgroundColor: [0, 0, 0, 100], // Черный фон
        pickable: true,
        onClick: ({ object }) => setSelectedHandover(object)
      }),
    showCollisionThree &&
      new ScatterplotLayer({
        id: 'collision-three-layer',
        data: collisionThreeData,
        pickable: true,
        opacity: 0.8,
        stroked: false,
        filled: true,
        radiusScale: 100,
        radiusMinPixels: 5,
        radiusMaxPixels: 5,
        getPosition: d => [parseFloat(d.longitude), parseFloat(d.latitude)],
        getFillColor: [0, 0, 0]
      }),
    showCollisionSix &&
      new ScatterplotLayer({
        id: 'collision-six-layer',
        data: collisionSixData,
        pickable: true,
        opacity: 0.8,
        stroked: false,
        filled: true,
        radiusScale: 100,
        radiusMinPixels: 5,
        radiusMaxPixels: 5,
        getPosition: d => [parseFloat(d.longitude), parseFloat(d.latitude)],
        getFillColor: [128, 0, 128]
      })
  ]

  const handleInputChange = (type: 'rsrp' | 'rsrq', index: number, value: string) => {
    setInputRange(prev => {
      const updated = { ...prev }
      updated[type][index] = parseInt(value)
      return updated
    })
  }

  const handleSliderChange = (newValue: [number, number]) => {
    setFilterValue(newValue)
    applyFilters()
  }

  const applyFilters = () => {
    setFilterRange(inputRange)
    console.log(handoversData)
    const filteredData = rawData.filter(marker => {
      const rsrp = parseFloat(marker.lte[0].rsrp)
      const rsrq = parseFloat(marker.lte[0].rsrq)
      const markerOperator = marker.operator?.toLowerCase()
      const markerTime = new Date(marker.time).getTime()

      const withinRSRP = rsrp >= inputRange.rsrp[0] && rsrp <= inputRange.rsrp[1]
      const withinRSRQ = rsrq >= inputRange.rsrq[0] && rsrq <= inputRange.rsrq[1]
      const operatorMatch = operator === 'all' || operator === markerOperator
      const withinTimeRange = markerTime >= filterValue![0] && markerTime <= filterValue![1]

      if (selectedLayer === 1) {
        return withinRSRP && operatorMatch && withinTimeRange
      }
      if (selectedLayer === 2) {
        return withinRSRQ && operatorMatch && withinTimeRange
      }
      return false
    })

    setMarkersData(filteredData)
  }

  const handleLayerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const layer = parseInt(event.target.value, 10)
    setSelectedLayer(layer)
  }

  const handleReset = () => {
    setShowCollisionSix(false)
    setShowCollisionThree(false)
    setFilterValue(getTimeRange)
    setSelectedLayer(0)
    setOperator('all')
  }

  const handleShow = () => {
    if (filterValue) {
      const [start, end] = filterValue
      fetchMarkers()
    }
  }

  const handleOperatorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOperator(event.target.value)
  }

  const handleShowProblemAreas = () => {
    setShowProblemAreas(!showProblemAreas)
  }

  const handleShowCollisionThree = () => {
    setShowCollisionThree(!showCollisionThree)
  }

  const handleShowCollisionSix = () => {
    setShowCollisionSix(!showCollisionSix)
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

          {selectedLayer > 0 && (
            <button
              className='mt-2 w-full rounded-md bg-red-500 py-2 text-white shadow-md hover:bg-red-600'
              onClick={handleShowProblemAreas}
            >
              {showProblemAreas ? 'Скрыть проблемные зоны' : 'Показать проблемные зоны'}
            </button>
          )}
          {selectedLayer > 0 && (
            <button
              onClick={() => setShowHandover(!showHandover)}
              className='mt-2 w-full rounded-md bg-purple-500 p-2 py-2 text-white'
            >
              {showHandover ? 'Скрыть хендоверы' : 'Показать хендоверы'}
            </button>
          )}
          {selectedLayer > 0 && (
            <div className='mt-2 space-y-2'>
              <button
                onClick={() => setShowArrows(!showArrows)}
                className='flex w-full items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white shadow transition duration-300 hover:bg-blue-600'
              >
                {showArrows ? 'Скрыть стрелки' : 'Показать стрелки'}
              </button>
              <button
                onClick={() => setShowArcs(!showArcs)}
                className='flex w-full items-center justify-center rounded-md bg-green-500 px-4 py-2 text-white shadow transition duration-300 hover:bg-green-600'
              >
                {showArcs ? 'Скрыть дуги' : 'Показать дуги'}
              </button>
              <button
                onClick={() => setShowIcons(!showIcons)}
                className='flex w-full items-center justify-center rounded-md bg-purple-500 px-4 py-2 text-white shadow transition duration-300 hover:bg-purple-600'
              >
                {showIcons ? 'Скрыть иконки' : 'Показать иконки'}
              </button>
              <button
                onClick={handleShowCollisionThree}
                className='flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-white shadow transition duration-300 hover:bg-gray-800'
              >
                {showCollisionThree ? 'Скрыть PCI коллизии 3' : 'Показать PCI коллизии 3'}
              </button>
              <button
                onClick={handleShowCollisionSix}
                className='flex w-full items-center justify-center rounded-md bg-purple-700 px-4 py-2 text-white shadow transition duration-300 hover:bg-purple-800'
              >
                {showCollisionSix ? 'Скрыть PCI коллизии 6' : 'Показать PCI коллизии 6'}
              </button>
            </div>
          )}
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

      <div className='absolute bottom-[62rem] right-4 z-10'>
        {selectedLayer === 1 && <JetColorTable />}
        {selectedLayer === 2 && <RSRQJetTable />}
      </div>
      {selectedHandover && (
        <div className='absolute bottom-20 right-4 z-20 w-64 rounded-lg bg-white p-4 text-black shadow-xl'>
          <h3 className='mb-2 font-bold'>Детали хендовера</h3>
          <div className='space-y-2'>
            <p>
              <span className='font-semibold'>Откуда:</span>
              <br />
              MCC: {selectedHandover.from.lte[0].mcc}
              <br />
              TAC: {selectedHandover.from.lte[0].tac}
              <br />
              PCI: {selectedHandover.from.lte[0].pci}
            </p>
            <p>
              <span className='font-semibold'>Куда:</span>
              <br />
              MCC: {selectedHandover.to.lte[0].mcc}
              <br />
              TAC: {selectedHandover.to.lte[0].tac}
              <br />
              PCI: {selectedHandover.to.lte[0].pci}
            </p>
            <p>
              <span className='font-semibold'>Координаты:</span>
              <br />
              От: {selectedHandover.from.latitude.toFixed(6)},{' '}
              {selectedHandover.from.longitude.toFixed(6)}
              <br />
              До: {selectedHandover.to.latitude.toFixed(6)},{' '}
              {selectedHandover.to.longitude.toFixed(6)}
            </p>
          </div>
          <button
            onClick={() => setSelectedHandover(null)}
            className='mt-3 w-full rounded bg-blue-500 py-1 text-white hover:bg-blue-600'
          >
            Закрыть
          </button>
        </div>
      )}
    </div>
  )
}
