/* eslint-disable max-len */
import { WebMercatorViewport } from '@deck.gl/core'
import {
  ArcLayer,
  IconLayer,
  LineLayer,
  PolygonLayer,
  ScatterplotLayer,
  TextLayer
} from '@deck.gl/layers'
import DeckGL from '@deck.gl/react'
import chroma from 'chroma-js'
import { useTheme } from 'next-themes'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Map as MapLibreMap, NavigationControl } from 'react-map-gl/maplibre'

// '../../../../coverage_tiles/'
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

interface BaseStation {
  lat: number
  lon: number
  mnc: number
  mcc: number
  earfcn: number
  ci: number
  polygons: {
    sector_angle: number
    vertices: [number, number][]
  }[]
}

interface SectorPolygon {
  bsId: number
  sectorId: number
  coordinates: [number, number][]
  baseStation: BaseStation
  sectorAngle: number
}

// Цвета для секторов
const sectorColors = [
  [255, 99, 132, 150],
  [54, 162, 235, 150],
  [75, 192, 192, 150]
]

const useMapState = () => {
  const [viewState, setViewState] = useState({
    longitude: 82.9296,
    latitude: 55.0152,
    zoom: 13,
    pitch: 0,
    bearing: 0
  })
  return [viewState, setViewState]
}

// const useMarkersData = () => {
//   const [markersData, setMarkersData] = useState<any[]>([])
//   return [markersData, setMarkersData]
// }

const useFilters = () => {
  const [selectedLayer, setSelectedLayer] = useState(0)
  const [operator, setOperator] = useState('all')
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
  const [showSectorPolygons, setShowSectorPolygons] = useState(false)
  const [showBaseStation, setShowBaseStation] = useState(false)
  const [baseStationsData, setBaseStationsData] = useState<BaseStation[]>([])
  const [sectorPolygons, setSectorPolygons] = useState<SectorPolygon[]>([])

  return {
    selectedLayer,
    setSelectedLayer,
    operator,
    setOperator,
    isLoading,
    setIsLoading,
    error,
    setError,
    selectedHandover,
    setSelectedHandover,
    showArrows,
    setShowArrows,
    showArcs,
    setShowArcs,
    showIcons,
    setShowIcons,
    handoversData,
    setHandoversData,
    filterValue,
    setFilterValue,
    inputRange,
    setInputRange,
    filterRange,
    setFilterRange,
    isPanelVisible,
    setIsPanelVisible,
    showProblemAreas,
    setShowProblemAreas,
    showHandover,
    setShowHandover,
    showCollisionThree,
    setShowCollisionThree,
    showCollisionSix,
    setShowCollisionSix,
    collisionThreeData,
    setCollisionThreeData,
    collisionSixData,
    setCollisionSixData,
    showSectorPolygons,
    setShowSectorPolygons,
    showBaseStation,
    setShowBaseStation,
    baseStationsData,
    setBaseStationsData,
    sectorPolygons,
    setSectorPolygons
  }
}

export const MapDeck = () => {
  const { t } = useTranslation('map')

  const [viewState, setViewState] = useMapState()
  // const [markersData, setMarkersData] = useMarkersData()
  const [markersData, setMarkersData] = useState<any[]>([])
  const [isSimulationVisible, setIsSimulationVisible] = useState(false)
  const [frequencies, setFrequencies] = useState('')
  const [heightTx, setHeightTx] = useState('')
  const [heightRx, setHeightRx] = useState('')
  const [transmitterPower, setTransmitterPower] = useState('')
  const [antennaGain, setAntennaGain] = useState('')
  const [cableLosses, setCableLosses] = useState('')
  const [shadowingStdDev, setShadowingStdDev] = useState('')
  const [additionalLosses, setAdditionalLosses] = useState('')
  const [model, setModel] = useState('COST Hata') // По умолчанию выбрана модель Кост-Хата

  // const [isSimulationVisible, setIsSimulationVisible] = useState(true);
  const filters = useFilters()
  const { theme } = useTheme()
  // const mapStyle = theme === 'dark' ? 'streets-dark' : 'streets'
  // const mapstyle = `https://api.maptiler.com/maps/${mapStyle}/style.json?key=${import.meta.env.VITE_MAPLIBRE_API_KEY}`
  const fetchWithTimeout = (url: string, timeout = 5000): Promise<string> =>
    Promise.race([
      fetch(url).then(async res => {
        if (!res.ok) throw new Error('HTTP error ' + res.status)

        const json = await res.json()
        if (!json || !json.version || !json.sources || !json.layers) {
          throw new Error('Invalid style JSON')
        }

        return url
      }),
      new Promise<string>((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
    ])

  const getResilientMapStyle = async (): Promise<string> => {
    const mapStyleName = theme === 'dark' ? 'streets-dark' : 'streets'
    const DEFAULT_STYLE = `https://api.maptiler.com/maps/${mapStyleName}/style.json?key=${import.meta.env.VITE_MAPLIBRE_API_KEY}`
    const FALLBACK_STYLES = ['https://basemaps.cartocdn.com/gl/positron-gl-style/style.json']

    const urls = [DEFAULT_STYLE, ...FALLBACK_STYLES]

    for (const url of urls) {
      try {
        const workingUrl = await fetchWithTimeout(url, 5000)
        return workingUrl
      } catch (_) {
        continue
      }
    }

    console.warn('Не удалось получить ни один рабочий стиль. Используется последний fallback.')
    return FALLBACK_STYLES[FALLBACK_STYLES.length - 1]
  }
  const [mapStyle, setMapStyle] = useState<string | null>(null)

  useEffect(() => {
    getResilientMapStyle().then(setMapStyle)
  }, [])
  // const mapstyle = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
  // const [sectorPolygons, setSectorPolygons] = useState<SectorPolygon[]>([])
  // const [showSectorPolygons, setShowSectorPolygons] = useState(false)
  const [selectedSector, setSelectedSector] = useState<SectorPolygon | null>(null)
  const [coverageType, setCoverageType] = useState<'heatmap' | null>(null)
  // const [showBaseStation, setShowBaseStation] = useState(false)
  // const [baseStationsData, setBaseStationsData] = useState<BaseStation[]>([])
  const [selectedBaseStation, setSelectedBaseStation] = useState<BaseStation | null>(null)
  // const [MmarkersData, setMMarkersData] = useState<any[]>([])
  const [RawData, setRawData] = useState<any[]>([])
  const [filterValue, setFilterValue] = useState<[number, number] | null>(null)

  const handleModelChange = event => {
    setModel(event.target.value)
  }

  const handleSubmit = () => {
    if (model === 'COST Hata') {
      console.log('Модель Кост-Хата:', {
        frequencies,
        heightTx,
        heightRx,
        transmitterPower,
        antennaGain,
        cableLosses
      })
    } else if (model === 'UMa') {
      console.log('Модель Ума:', {
        frequencies,
        heightTx,
        heightRx,
        transmitterPower,
        antennaGain,
        cableLosses,
        shadowingStdDev,
        additionalLosses
      })
    }
  }

  const processSectorPolygons = (baseStations: BaseStation[]): SectorPolygon[] =>
    baseStations.flatMap(bs => {
      if (!bs.polygons?.length) return []

      return bs.polygons.map((polygon, index) => {
        const vertices = polygon.vertices.map(([lat, lon]) => [lon, lat] as [number, number])

        if (vertices.length > 0 && !arePointsEqual(vertices[0], vertices[vertices.length - 1])) {
          vertices.push([...vertices[0]])
        }

        return {
          bsId: bs.ci,
          sectorId: index + 1,
          coordinates: vertices,
          baseStation: bs,
          sectorAngle: polygon.sector_angle
        }
      })
    })

  const arePointsEqual = (a: [number, number], b: [number, number], precision = 9) =>
    a[0].toFixed(precision) === b[0].toFixed(precision) &&
    a[1].toFixed(precision) === b[1].toFixed(precision)

  const getSectorColor = (bsId: number, sectorId: number): [number, number, number, number] => {
    const baseHue = (bsId * 137) % 360
    const hue = (baseHue + sectorId * 60) % 360
    const saturation = 80 + ((sectorId * 10) % 20)
    const lightness = 50 + ((sectorId * 7) % 15)
    const color = chroma.hsl(hue, saturation / 100, lightness / 100)
    return [color.get('rgb.r'), color.get('rgb.g'), color.get('rgb.b'), 150]
  }

  const getTimeRange = useMemo(() => {
    const start = new Date('2024-01-01T00:00:00.000Z').getTime()
    const end = new Date().getTime()
    return [start, end]
  }, [])

  useEffect(() => {
    setFilterValue(getTimeRange)
  }, [getTimeRange])

  const getUniqueColor = index =>
    chroma.hsv((index * 360) / filters.handoversData.length, 0.7, 0.8).rgb()

  const fetchMarkers = useCallback(
    async bounds => {
      try {
        filters.setIsLoading(true)
        const [data, handovers, collisionThree, collisionSix, data2] = await Promise.all([
          api.getThermalMapDataPoint(bounds.minLat, bounds.minLng, bounds.maxLat, bounds.maxLng),
          api.getThermalMapDataHandover(bounds.minLat, bounds.minLng, bounds.maxLat, bounds.maxLng),
          api.getCollisionThree(bounds.minLat, bounds.minLng, bounds.maxLat, bounds.maxLng),
          api.getCollisionSix(bounds.minLat, bounds.minLng, bounds.maxLat, bounds.maxLng),
          // api.getBSData(55.0, 82.0, 56.0, 83.0)
          api.getBSData(bounds.minLat, bounds.minLng, bounds.maxLat, bounds.maxLng)
        ])

        filters.setCollisionThreeData(collisionThree)
        filters.setCollisionSixData(collisionSix)

        // const data2 = api.getBSData(55.0, 82.0, 56.0, 83.0)
        filters.setBaseStationsData(data2)
        const polygons = processSectorPolygons(data2)
        filters.setSectorPolygons(polygons)

        filters.setHandoversData(handovers.map(pair => ({ from: pair[0], to: pair[1] })))

        setMarkersData(data.filter(item => item?.lte?.length > 0))
        const filteredData = data.filter(
          (item: ThermalMapDataPoint) =>
            item && item.lte && Array.isArray(item.lte) && item.lte.length > 0
        )
        setRawData(filteredData)
        setFilterValue(null)
        // setMarkersData(filteredData)
      } catch (err) {
        filters.setError('Error loading markers')
      } finally {
        filters.setIsLoading(false)
      }
    },
    [filters]
  )

  const handleViewStateChange = useCallback(
    ({ viewState }) => {
      setViewState(viewState)

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      debounceTimeoutRef.current = setTimeout(() => {
        const bounds = getPreciseViewBounds(viewState)
        fetchMarkers(bounds)
      }, 1000)
    },
    [fetchMarkers]
  )

  const getPreciseViewBounds = viewState => {
    const { width, height, latitude, longitude, zoom, pitch, bearing } = viewState

    const viewport = new WebMercatorViewport({
      width,
      height,
      latitude,
      longitude,
      zoom,
      pitch,
      bearing
    })

    const [minLng, minLat] = viewport.unproject([0, height])
    const [maxLng, maxLat] = viewport.unproject([width, 0])

    return {
      minLng: Math.min(minLng, maxLng),
      minLat: Math.min(minLat, maxLat),
      maxLng: Math.max(minLng, maxLng),
      maxLat: Math.max(minLat, maxLat)
    }
  }

  const debounceTimeoutRef = useRef<NodeJS.Timeout>()

  const layers = useMemo(
    () => [
      filters.selectedLayer === 1 &&
        markersData &&
        new ScatterplotLayer({
          id: 'rsrp-layer',
          data: markersData,
          pickable: true,
          opacity: 1,
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
      filters.selectedLayer === 2 &&
        markersData &&
        new ScatterplotLayer({
          id: 'rsrq-layer',
          data: markersData,
          pickable: true,
          opacity: 1,
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
      filters.showProblemAreas &&
        new ScatterplotLayer({
          id: 'problem-areas-layer',
          data: markersData.filter(d => {
            const rsrp = d.lte[0]?.rsrp
            const rsrq = d.lte[0]?.rsrq
            return (
              (filters.selectedLayer === 1 && rsrp < -100) ||
              (filters.selectedLayer === 2 && rsrq < -20)
            )
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
            if (filters.selectedLayer === 1 && rsrp < -100) {
              return [255, 0, 0, 128] // Красный с прозрачностью
            }
            if (filters.selectedLayer === 2 && rsrq < -20) {
              return [0, 0, 255, 128] // Синий с прозрачностью
            }
            return [0, 0, 0]
          },
          getLineColor: d => {
            const rsrp = d.lte[0]?.rsrp
            const rsrq = d.lte[0]?.rsrq
            if (filters.selectedLayer === 1 && rsrp < -100) {
              return [255, 0, 0] // Красный
            }
            if (filters.selectedLayer === 2 && rsrq < -20) {
              return [0, 0, 255] // Синий
            }
            return [0, 0, 0]
          },
          lineWidthMinPixels: 2
        }),
      filters.showHandover &&
        new LineLayer({
          id: 'handovers-layer',
          data: filters.handoversData,
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
          onClick: ({ object }) => filters.setSelectedHandover(object)
        }),
      filters.showHandover &&
        filters.showArcs &&
        new ArcLayer({
          id: 'handovers-arcs-layer',
          data: filters.handoversData,
          getSourcePosition: d => [d.from.longitude, d.from.latitude],
          getTargetPosition: d => [d.to.longitude, d.to.latitude],
          getSourceColor: [0, 128, 255], // Синий для начала дуги
          getTargetColor: [255, 0, 128], // Розовый для конца дуги
          getWidth: 2,
          getHeight: 0.2, // Высота дуги в градусах
          pickable: true,
          greatCircle: false, // Дуга по большому кругу
          onClick: ({ object }) => filters.setSelectedHandover(object)
        }),
      filters.showHandover &&
        filters.showArrows &&
        new IconLayer({
          id: 'handovers-start-points-layer',
          data: filters.handoversData,
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
          onClick: ({ object }) => filters.setSelectedHandover(object)
        }),
      filters.showHandover &&
        filters.showArrows &&
        new IconLayer({
          id: 'handovers-icons-layer',
          data: filters.handoversData,
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
          onClick: ({ object }) => filters.setSelectedHandover(object)
        }),
      filters.showHandover &&
        filters.showIcons &&
        new TextLayer({
          id: 'handovers-text-layer',
          data: filters.handoversData,
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
          onClick: ({ object }) => filters.setSelectedHandover(object)
        }),
      filters.showCollisionThree &&
        new ScatterplotLayer({
          id: 'collision-three-layer',
          data: filters.collisionThreeData,
          pickable: true,
          opacity: 0.8,
          stroked: false,
          filled: true,
          radiusScale: 100,
          radiusMinPixels: 4,
          radiusMaxPixels: 4,
          getPosition: d => [parseFloat(d.longitude), parseFloat(d.latitude)],
          getFillColor: [0, 0, 0]
        }),
      filters.showCollisionSix &&
        new ScatterplotLayer({
          id: 'collision-six-layer',
          data: filters.collisionSixData,
          pickable: true,
          opacity: 0.8,
          stroked: false,
          filled: true,
          radiusScale: 100,
          radiusMinPixels: 4,
          radiusMaxPixels: 4,
          getPosition: d => [parseFloat(d.longitude), parseFloat(d.latitude)],
          getFillColor: [128, 0, 128]
        }),
      filters.showBaseStation &&
        filters.showSectorPolygons &&
        new PolygonLayer({
          id: 'sector-polygon-layer',
          data: filters.sectorPolygons,
          getPolygon: d => d.coordinates,
          stroked: true,
          filled: true,
          extruded: false,
          wireframe: false,
          getFillColor: d => getSectorColor(d.bsId, d.sectorId),
          getLineColor: [255, 255, 255],
          getLineWidth: 1,
          pickable: true,
          opacity: 0.1, // Добавьте это для контроля общей прозрачности
          onClick: ({ object }) => setSelectedSector(object)
        }),
      filters.showBaseStation &&
        new IconLayer({
          id: 'base-stations-layer',
          data: filters.baseStationsData,
          pickable: true,
          iconAtlas: '/antenna.png',
          iconMapping: {
            marker: {
              x: 0,
              y: 0,
              width: 100,
              height: 100,
              anchorY: 100,
              mask: false
            }
          },
          getIcon: () => 'marker',
          getPosition: d => [parseFloat(d.lon), parseFloat(d.lat)],
          getSize: 40,
          getColor: [0, 0, 255],
          onClick: ({ object }) => setSelectedBaseStation(object)
        })
    ],
    [filters, markersData]
  )

  const handleInputChange = (type: 'rsrp' | 'rsrq', index: number, value: string) => {
    filters.setInputRange(prev => {
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
    filters.setFilterRange(filters.inputRange)
    const filteredData = RawData.filter(marker => {
      const rsrp = parseFloat(marker.lte[0].rsrp)
      const rsrq = parseFloat(marker.lte[0].rsrq)
      const markerOperator = marker.operator?.toLowerCase()
      const markerTime = new Date(marker.time).getTime()

      const withinRSRP = rsrp >= filters.inputRange.rsrp[0] && rsrp <= filters.inputRange.rsrp[1]
      const withinRSRQ = rsrq >= filters.inputRange.rsrq[0] && rsrq <= filters.inputRange.rsrq[1]
      const operatorMatch = filters.operator === 'all' || filters.operator === markerOperator
      const withinTimeRange = markerTime >= filterValue![0] && markerTime <= filterValue![1]

      if (filters.selectedLayer === 1) {
        return withinRSRP && operatorMatch && withinTimeRange
      }
      if (filters.selectedLayer === 2) {
        return withinRSRQ && operatorMatch && withinTimeRange
      }
      return false
    })

    setMarkersData(filteredData)
  }

  const handleLayerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const layer = parseInt(event.target.value, 10)
    filters.setSelectedLayer(layer)
  }

  const handleReset = () => {
    filters.setShowCollisionSix(false)
    filters.setShowCollisionThree(false)
    setFilterValue(getTimeRange)
    filters.setSelectedLayer(0)
    filters.setOperator('all')
  }

  const handleShow = () => {
    if (filterValue) {
      const [start, end] = filterValue
      const bounds = getViewBounds(viewState)
      fetchMarkers(bounds)
    }
  }

  const handleOperatorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    filters.setOperator(event.target.value)
  }

  const handleShowProblemAreas = () => {
    filters.setShowProblemAreas(!filters.showProblemAreas)
  }

  const handleShowCollisionThree = () => {
    filters.setShowCollisionThree(!filters.showCollisionThree)
  }

  const handleShowCollisionSix = () => {
    filters.setShowCollisionSix(!filters.showCollisionSix)
  }

  return (
    <div className='relative h-full w-full'>
      <button
        className='absolute left-4 top-4 z-10 rounded-full bg-blue-500 p-3 text-white shadow-lg hover:bg-blue-600'
        onClick={() => filters.setIsPanelVisible(!filters.isPanelVisible)}
      >
        {filters.isPanelVisible ? t('close') : t('filters')}
      </button>

      <button
        className='absolute right-4 top-4 z-10 rounded-full bg-blue-500 p-3 text-white shadow-lg hover:bg-blue-600'
        onClick={() => setIsSimulationVisible(!isSimulationVisible)}
      >
        {isSimulationVisible ? t('hide_simulation') : t('simulation')}
      </button>

      {/* Форма симуляции */}
      {isSimulationVisible && (
        <div className='absolute right-4 top-20 z-50 w-80 rounded-lg bg-white p-4 shadow-lg transition-transform duration-300'>
          <select value={model} onChange={handleModelChange} className='mb-4'>
            <option value='COST Hata'>COST Hata</option>
            <option value='UMa'>UMa</option>
          </select>
          <div className='mb-4'>
            <label className='block font-medium text-gray-700'>{t('frequency')}</label>
            <input
              type='text'
              value={frequencies}
              onChange={e => setFrequencies(e.target.value)}
              placeholder={t('GHz')}
              className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
          <div className='mb-4'>
            <label className='block font-medium text-gray-700'>
              {t('height_of_transmitting_antenna')}
            </label>
            <input
              type='text'
              value={heightTx}
              onChange={e => setHeightTx(e.target.value)}
              placeholder={t('m')}
              className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
          <div className='mb-4'>
            <label className='block font-medium text-gray-700'>
              {t('height_of_receiving_antenna')}
            </label>
            <input
              type='text'
              value={heightRx}
              onChange={e => setHeightRx(e.target.value)}
              placeholder={t('m')}
              className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
          <div className='mb-4'>
            <label className='block font-medium text-gray-700'>{t('transmitter_power')}</label>
            <input
              type='text'
              value={transmitterPower}
              onChange={e => setTransmitterPower(e.target.value)}
              placeholder={t('dBm')}
              className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
          <div className='mb-4'>
            <label className='block font-medium text-gray-700'>{t('antenna_gain')}</label>
            <input
              type='text'
              value={antennaGain}
              onChange={e => setAntennaGain(e.target.value)}
              placeholder={t('dBi')}
              className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
          <div className='mb-4'>
            <label className='block font-medium text-gray-700'>{t('cable_losses')}</label>
            <input
              type='text'
              value={cableLosses}
              onChange={e => setCableLosses(e.target.value)}
              placeholder={t('dB')}
              className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
          {model === 'UMa' && (
            <>
              <div className='mb-4'>
                <label className='block font-medium text-gray-700'>
                  {t('standard_deviation_of_shading')}
                </label>
                <input
                  type='text'
                  value={shadowingStdDev}
                  onChange={e => setShadowingStdDev(e.target.value)}
                  placeholder={t('dB')}
                  className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
              <div className='mb-4'>
                <label className='block font-medium text-gray-700'>
                  {t('additional_environmental_losses')}
                </label>
                <input
                  type='text'
                  value={additionalLosses}
                  onChange={e => setAdditionalLosses(e.target.value)}
                  placeholder={t('dB')}
                  className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
            </>
          )}
          <button
            onClick={handleSubmit}
            className='w-full rounded-md bg-blue-500 py-2 text-white shadow-md hover:bg-blue-600'
          >
            {t('show')}
          </button>
        </div>
      )}

      {filters.isPanelVisible && (
        <div className='absolute left-4 top-20 z-10 w-80 rounded-lg bg-white p-4 shadow-lg transition-transform duration-300'>
          <label htmlFor='operator-select' className='mb-2 block font-medium text-gray-700'>
            {t('operator')}
          </label>
          <select
            id='operator-select'
            value={filters.operator}
            onChange={handleOperatorChange}
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          >
            <option value='all'>{t('all_operators')}</option>
            <option value='yota'>Yota</option>
            <option value='beeline'>Beeline</option>
            <option value='mts'>MTS</option>
            <option value='megafon'>Megafon</option>
          </select>

          <div className='mt-4'>
            <label htmlFor='layer-select' className='mb-2 block font-medium text-gray-700'>
              {t('layer_selection')}
            </label>
            <select
              id='layer-select'
              value={filters.selectedLayer}
              onChange={handleLayerChange}
              className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            >
              <option value={0}>{t('select_a_layer')}</option>
              <option value={1}>RSRP</option>
              <option value={2}>RSRQ</option>
            </select>
          </div>

          {filters.selectedLayer > 0 && (
            <button
              className='mt-2 flex w-full items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white shadow transition duration-300 hover:bg-blue-600'
              onClick={handleShowProblemAreas}
            >
              {filters.showProblemAreas ? t('hide_problem_areas') : t('show_problem_areas')}
            </button>
          )}
          {filters.selectedLayer > 0 && (
            <button
              onClick={() => filters.setShowHandover(!filters.showHandover)}
              className='mt-2 flex w-full items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white shadow transition duration-300 hover:bg-blue-600'
            >
              {filters.showHandover ? t('hide_handovers') : t('show_handovers')}
            </button>
          )}
          {filters.selectedLayer > 0 && (
            <div className='mt-2 space-y-2'>
              <button
                onClick={() => filters.setShowBaseStation(!filters.showBaseStation)}
                className='flex w-full items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white shadow transition duration-300 hover:bg-blue-600'
              >
                {filters.showBaseStation ? t('hide_bs') : t('show_bs')}
              </button>
              <button
                onClick={() => filters.setShowSectorPolygons(!filters.showSectorPolygons)}
                className='flex w-full items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white shadow transition duration-300 hover:bg-blue-600'
              >
                {filters.showSectorPolygons ? t('hide_sector_polygons') : t('show_sector_polygons')}
              </button>
              <button
                onClick={() => filters.setShowArrows(!filters.showArrows)}
                className='flex w-full items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white shadow transition duration-300 hover:bg-blue-600'
              >
                {filters.showArrows ? t('hide_the_arrows') : t('show_the_arrows')}
              </button>
              <button
                onClick={() => filters.setShowArcs(!filters.showArcs)}
                className='flex w-full items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white shadow transition duration-300 hover:bg-blue-600'
              >
                {filters.showArcs ? t('hide_arcs') : t('show_arcs')}
              </button>
              <button
                onClick={() => filters.setShowIcons(!filters.showIcons)}
                className='flex w-full items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white shadow transition duration-300 hover:bg-blue-600'
              >
                {filters.showIcons ? t('hide_icons') : t('show_icons')}
              </button>
              <button
                onClick={handleShowCollisionThree}
                className='flex w-full items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white shadow transition duration-300 hover:bg-blue-600'
              >
                {filters.showCollisionThree
                  ? t('hide_PCI_collisions_3')
                  : t('show_PCI_collisions_3')}
              </button>
              <button
                onClick={handleShowCollisionSix}
                className='flex w-full items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white shadow transition duration-300 hover:bg-blue-600'
              >
                {filters.showCollisionSix ? t('hide_PCI_collisions_6') : t('show_PCI_collisions_6')}
              </button>
            </div>
          )}
          {filters.selectedLayer === 1 && (
            <div className='mt-4'>
              <label className='block font-medium text-gray-700'>{t('rsrp_range')}</label>
              <div className='mt-2 flex items-center justify-between'>
                <input
                  type='number'
                  value={filters.inputRange.rsrp[0]}
                  onChange={e => handleInputChange('rsrp', 0, e.target.value)}
                  className='w-24 rounded-md border-gray-300 text-center shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
                <span className='mx-2'>-</span>
                <input
                  type='number'
                  value={filters.inputRange.rsrp[1]}
                  onChange={e => handleInputChange('rsrp', 1, e.target.value)}
                  className='w-24 rounded-md border-gray-300 text-center shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
            </div>
          )}

          {filters.selectedLayer === 2 && (
            <div className='mt-4'>
              <label className='block font-medium text-gray-700'>Диапазон RSRQ:</label>
              <div className='mt-2 flex items-center justify-between'>
                <input
                  type='number'
                  value={filters.inputRange.rsrq[0]}
                  onChange={e => handleInputChange('rsrq', 0, e.target.value)}
                  className='w-24 rounded-md border-gray-300 text-center shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
                <span className='mx-2'>-</span>
                <input
                  type='number'
                  value={filters.inputRange.rsrq[1]}
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
              {t('reset')}
            </button>
            <button
              onClick={applyFilters}
              className='w-[48%] rounded-md bg-blue-500 py-2 text-white shadow-md hover:bg-blue-600'
            >
              {t('apply')}
            </button>
          </div>
        </div>
      )}

      <DeckGL
        initialViewState={viewState}
        controller={true}
        layers={layers}
        onViewStateChange={handleViewStateChange}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      >
        <MapLibreMap mapStyle={mapStyle}>
          <NavigationControl position='top-left' />
        </MapLibreMap>
      </DeckGL>

      <div className='z-9999 absolute bottom-10 left-[40rem] flex w-[40rem] flex-col items-center phone:left-[8rem] phone:w-[30rem]'>
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

        {/* <button onClick={handleShow} className='mt-4 bg-blue-500 p-2 text-white'>
          Показать
        </button> */}
      </div>

      <div className='absolute bottom-[62rem] right-4 z-10 phone:bottom-[115rem] phone:right-0'>
        {filters.selectedLayer === 1 && <JetColorTable />}
        {filters.selectedLayer === 2 && <RSRQJetTable />}
      </div>
      {filters.selectedHandover && (
        <div className='absolute bottom-20 right-4 z-20 w-64 rounded-lg bg-white p-4 text-black shadow-xl'>
          <h3 className='mb-2 font-bold'>{t('details_of_the_handover')}</h3>
          <div className='space-y-2'>
            <p>
              <span className='font-semibold'>{t('from')}</span>
              <br />
              MCC: {filters.selectedHandover.from.lte[0].mcc}
              <br />
              TAC: {filters.selectedHandover.from.lte[0].tac}
              <br />
              PCI: {filters.selectedHandover.from.lte[0].pci}
            </p>
            <p>
              <span className='font-semibold'>{t('where')}</span>
              <br />
              MCC: {filters.selectedHandover.to.lte[0].mcc}
              <br />
              TAC: {filters.selectedHandover.to.lte[0].tac}
              <br />
              PCI: {filters.selectedHandover.to.lte[0].pci}
            </p>
            <p>
              <span className='font-semibold'>{t('coordinates')}</span>
              <br />
              {t('by')} {filters.selectedHandover.from.latitude.toFixed(6)},{' '}
              {filters.selectedHandover.from.longitude.toFixed(6)}
              <br />
              {t('to')} {filters.selectedHandover.to.latitude.toFixed(6)},{' '}
              {filters.selectedHandover.to.longitude.toFixed(6)}
            </p>
          </div>
          <button
            onClick={() => filters.setSelectedHandover(null)}
            className='mt-3 w-full rounded bg-blue-500 py-1 text-white hover:bg-blue-600'
          >
            {t('close')}
          </button>
        </div>
      )}

      {selectedBaseStation && (
        <div className='absolute right-4 top-20 z-20 w-64 rounded-lg bg-white p-4 text-black shadow-xl'>
          <h3 className='mb-2 font-bold'>{t('BS_info')}</h3>
          <div className='space-y-2'>
            <p>
              <span className='font-semibold'>MNC:</span> {selectedBaseStation.mnc}
            </p>
            <p>
              <span className='font-semibold'>MCC:</span> {selectedBaseStation.mcc}
            </p>
            <p>
              <span className='font-semibold'>earfcn</span> {selectedBaseStation.earfcn}
            </p>
            <p>
              <span className='font-semibold'>CI</span> {selectedBaseStation.ci}
            </p>
            <p>
              <span className='font-semibold'>{t('Latitude')}</span>{' '}
              {selectedBaseStation.lat.toFixed(6)}
            </p>
            <p>
              <span className='font-semibold'>{t('Longitude')}:</span>{' '}
              {selectedBaseStation.lon.toFixed(6)}
            </p>
          </div>
          <button
            onClick={() => setSelectedBaseStation(null)}
            className='mt-3 w-full rounded bg-blue-500 py-1 text-white hover:bg-blue-600'
          >
            {t('close')}
          </button>
        </div>
      )}

      {selectedSector && (
        <div className='absolute bottom-20 right-4 z-20 w-64 rounded-lg bg-white p-4 text-black shadow-xl'>
          <h3 className='mb-2 font-bold'>{t('sector_info')}</h3>
          <div className='space-y-2'>
            <p>
              <span className='font-semibold'>{t('bs')}</span> {selectedSector.baseStation.ci}
            </p>
            <p>
              <span className='font-semibold'>{t('sector')}</span> {selectedSector.sectorId}
            </p>
            <p>
              <span className='font-semibold'>{t('direction_angle')}</span>{' '}
              {selectedSector.sectorAngle.toFixed(2)}°
            </p>
            <p>
              <span className='font-semibold'>MCC:</span> {selectedSector.baseStation.mcc}
            </p>
            <p>
              <span className='font-semibold'>MNC:</span> {selectedSector.baseStation.mnc}
            </p>
            <div>
              <span className='font-semibold'>{t('sector_coordinates')}</span>
              <div className='mt-1 max-h-40 overflow-y-auto bg-gray-100 p-2 text-xs'>
                {selectedSector.coordinates.map((coord, index) => (
                  <div key={index}>
                    {coord[0]}, {coord[1]}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedSector(null)}
            className='mt-3 w-full rounded bg-blue-500 py-1 text-white hover:bg-blue-600'
          >
            {t('close')}
          </button>
        </div>
      )}
    </div>
  )
}
