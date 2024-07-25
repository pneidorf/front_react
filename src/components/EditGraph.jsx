import React, { useRef, useEffect, useState } from 'react'
import axios from 'axios'
import { getThermalMapData } from '../shared/api/index.jsx'
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

export default function EditGraph({ isChecked3 }) {
  const [markersData, setMarkersData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getThermalMapData()

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
  }, [isChecked3])

  return (
    <form className='map-container-form'>
      <input placeholder='Bandwith' />
      <input placeholder='...' />
      <input placeholder='...' />
      <input placeholder='...' />
      <input placeholder='...' />
      <button className='form-button' type='button'>
        Рассчитать
      </button>
    </form>
  )
}
