import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import { useFetchMarkers } from '~/entities/markers'

interface PlotProps {
  timeStart: string
  timeEnd: string
}

export const PlotRSRQ = ({ timeStart, timeEnd }: PlotProps) => {
  const { data: markersData } = useFetchMarkers(timeStart, timeEnd)

  const filteredData = markersData
    ?.map(marker => {
      const lteData = marker.lte && marker.lte.length > 0 ? marker.lte[0] : null
      return {
        time: new Date(marker.CreatedAt).toISOString(),
        rsrq: lteData ? lteData.rsrq : null
      }
    })
    .filter((_, index) => index % 80 === 0)

  return (
    <div className='map-block'>
      <div className='map-container-small'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart width={500} height={300} data={filteredData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='time' />
            <YAxis domain={[-30, 0]} />
            <Tooltip />
            <Legend />
            <Line type='monotone' dataKey='rsrq' stroke='#8884d8' activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
