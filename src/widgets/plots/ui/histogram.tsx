import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import { useFetchMarkers } from '~/entities/markers'

interface HistogramProps {
  timeStart: string
  timeEnd: string
}

export const HistogramRSRP = ({ timeStart, timeEnd }: HistogramProps) => {
  const { data: markersData } = useFetchMarkers(timeStart, timeEnd)
  console.log(markersData)

  const rsrpCounts = markersData?.reduce((acc: { [key: number]: number }, marker) => {
    marker.lte?.forEach((lteEntry: { rsrp: number }) => {
      const rsrp = Math.round(lteEntry.rsrp)
      acc[rsrp] = (acc[rsrp] || 0) + 1
    })
    return acc
  }, {})
  console.log(rsrpCounts)

  const histogramData = Object.entries(rsrpCounts || {})
    .map(([rsrp, count]) => ({
      rsrp: Number(rsrp),
      count
    }))
    .sort((a, b) => a.rsrp - b.rsrp)

  return (
    <div className='map-block'>
      <div className='map-container-small'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='rsrp'
              label={{ value: 'RSRP', position: 'insideBottom', offset: -5 }}
              interval={0}
              angle={-45}
              textAnchor='end'
            />
            <YAxis label={{ value: 'Количество', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey='count' fill='#8884d8' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export const HistogramRSRQ = ({ timeStart, timeEnd }: HistogramProps) => {
  const { data: markersData } = useFetchMarkers(timeStart, timeEnd)
  console.log(markersData)

  const rsrqCounts = markersData?.reduce((acc: { [key: number]: number }, marker) => {
    marker.lte?.forEach((lteEntry: { rsrq: number }) => {
      const rsrq = Math.round(lteEntry.rsrq)
      acc[rsrq] = (acc[rsrq] || 0) + 1
    })
    return acc
  }, {})
  console.log(rsrqCounts)

  const histogramData = Object.entries(rsrqCounts || {})
    .map(([rsrq, count]) => ({
      rsrq: Number(rsrq),
      count
    }))
    .sort((a, b) => a.rsrq - b.rsrq)

  return (
    <div className='map-block'>
      <div className='map-container-small'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='rsrq'
              label={{ value: 'RSRQ', position: 'insideBottom', offset: -5 }}
              interval={0}
              angle={-45}
              textAnchor='end'
            />
            <YAxis label={{ value: 'Количество', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey='count' fill='#47A76A' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
