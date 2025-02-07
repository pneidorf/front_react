/* eslint-disable max-len */
import { useEffect, useState } from 'react'
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

interface MarkerData {
  CreatedAt: string
  lte: {
    rsrp?: number
    rsrq?: number
    [key: string]: number | string | undefined
  }[]
}

interface FormattedData {
  time: string
  value: number | string | null
}

interface PlotProps {
  timeStart: string
  timeEnd: string
  selectedMetric: string
  selectedOperator: string
  selectedCellId: string
  selectedBand: string
}

export const Plot = ({
  timeStart,
  timeEnd,
  selectedMetric,
  selectedOperator,
  selectedCellId,
  selectedBand
}: PlotProps) => {
  const [data, setData] = useState<FormattedData[]>([])
  useEffect(() => {
    if (
      timeStart &&
      timeEnd &&
      selectedMetric &&
      selectedOperator &&
      selectedCellId &&
      selectedBand
    ) {
      const url = `http://109.172.114.128:3000/api/v1/filter/data/starttime-${timeStart}/endtime-${timeEnd}/ltemnc-${selectedOperator}/lteci-${selectedCellId}/lteband-${selectedBand}`

      fetch(url)
        .then(response => response.json())
        .then((response: MarkerData[]) => {
          const formattedData: FormattedData[] = response.map((marker: MarkerData) => {
            const lteData = marker.lte ? marker.lte[0] : null
            if (lteData) {
              return {
                time: new Date(marker.CreatedAt).toISOString(),
                value: lteData[selectedMetric.toLowerCase()] ?? null
              }
            }
            return { time: new Date(marker.CreatedAt).toISOString(), value: null }
          })
          // .filter((_, index: number) => index % 80 === 0)

          setData(formattedData)
        })
        .catch(console.error)
    }
  }, [timeStart, timeEnd, selectedMetric, selectedOperator, selectedCellId, selectedBand])

  return (
    <div className='map-block'>
      <div className='map-container-small'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='time' />
            <YAxis domain={[-150, 'dataMax + 50']} />
            <Tooltip />
            <Legend />
            <Line
              type='monotone'
              dataKey='value'
              name={selectedMetric}
              stroke='#8884d8'
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
