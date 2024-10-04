import React from 'react'
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

export const Plot = () => {
  const { data: markersData } = useFetchMarkers()

  // Фильтруем данные, чтобы оставить только каждую 10-ю запись
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
