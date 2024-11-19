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

export const Plot = ({ timeStart, timeEnd }: PlotProps) => {
  const { data: markersData } = useFetchMarkers(timeStart, timeEnd)

  const filteredData = markersData?.filter((_, index) => index % 80 === 0)

  return (
    <div className='map-block'>
      <div className='map-container-small'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart width={500} height={300} data={filteredData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='time' />
            <YAxis domain={[-150, 'dataMax + 50']} />
            <Tooltip />
            <Legend />
            <Line type='monotone' dataKey='rsrp' stroke='#8884d8' activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
