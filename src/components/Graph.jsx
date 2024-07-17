import React, { useRef, useEffect, useState } from 'react'
import axios from 'axios'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

export default function Graph({ isChecked1 }) {
  const [markersData, setMarkersData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://78.24.222.170:8080/api/sockets/thermalmapdata')

        if (result.data && Array.isArray(result.data)) {
          const filteredData = result.data.filter((_, index) => index % 80 === 0)
          setMarkersData(
            filteredData.map(data => ({
              position: [data.longitude, data.latitude],
              key: data.id,
              rsrp: data.rsrp,
              time: data.time
            }))
          )
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [isChecked1])

  return (
    <div className='map-block'>
      <div className='map-container-small'>
        {' '}
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart width={500} height={300} data={markersData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='time' />
            <YAxis domain={[-200, 'dataMax + 50']} />
            <Tooltip />
            <Legend />
            <Line type='monotone' dataKey='rsrp' stroke='#8884d8' activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
