/* eslint-disable i18next/no-literal-string */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { api } from '~/shared/api'

const MNC_MAP = {
  '1': 'Билайн',
  '2': 'Yota',
  '20': 'Мегафон',
  '99': 'МТС'
} as const

const COLORS = {
  МТС: '#FF0000',
  Мегафон: '#00B050',
  Yota: '#1E90FF',
  Билайн: '#FFD700'
} as const

type OperatorLabel = keyof typeof COLORS

const mncCodes = ['1', '2', '20', '99']

export const CDFPlot = () => {
  const [dataType, setDataType] = useState<'rsrp' | 'rsrq'>('rsrp')
  const [cdfData, setCdfData] = useState<Record<string, { x: number; y: number }[]>>({})
  const [meta, setMeta] = useState<Record<string, { label: string; count: number }>>({})

  useEffect(() => {
    const fetchData = async () => {
      const newData: Record<string, { x: number; y: number }[]> = {}
      const newMeta: typeof meta = {}

      await Promise.all(
        mncCodes.map(async mnc => {
          try {
            const data = await api.getCDFOperator(mnc)
            const label = MNC_MAP[mnc as keyof typeof MNC_MAP] ?? 'Неизвестно'
            const mean = data[dataType] as number
            const count = data[`${dataType}_count`] as number

            const min = dataType === 'rsrp' ? -140 : -20
            const max = dataType === 'rsrp' ? -40 : -3
            const step = (max - min) / 100

            const cdf: { x: number; y: number }[] = []

            for (let i = 0; i <= 100; i++) {
              const x = min + i * step
              const y = 1 / (1 + Math.exp(-(x - mean) / 3))
              cdf.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(4)) })
            }

            newData[label] = cdf
            newMeta[label] = { label, count }
          } catch (error) {
            console.error(`Ошибка при получении данных для оператора ${mnc}`)
          }
        })
      )

      setCdfData(newData)
      setMeta(newMeta)
    }

    fetchData()
  }, [dataType])

  const combinedData = Array.from({ length: 101 }, (_, i) => {
    const entry: Record<string, any> = { x: null }
    for (const label in cdfData) {
      const point = cdfData[label][i]
      entry.x = point?.x
      entry[label] = point?.y
    }
    return entry
  })

  return (
    <div className='map-block'>
      <div className='map-container-small'>
        <div>
          <label className='pr-[2rem]'>
            <input
              type='radio'
              value='rsrp'
              checked={dataType === 'rsrp'}
              onChange={() => setDataType('rsrp')}
            />
            RSRP
          </label>
          <label>
            <input
              type='radio'
              value='rsrq'
              checked={dataType === 'rsrq'}
              onChange={() => setDataType('rsrq')}
            />
            RSRQ
          </label>
        </div>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <XAxis
              dataKey='x'
              label={{
                value: dataType.toUpperCase() + ' (дБ)',
                position: 'insideBottomRight',
                offset: -5
              }}
              domain={['auto', 'auto']}
            />
            <YAxis
              label={{ value: 'CDF (P)', angle: -90, position: 'insideLeft' }}
              domain={[0, 1]}
            />
            <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)} %`} />
            <Legend formatter={value => `${value} (${meta[value]?.count || 0} точек)`} />
            {Object.keys(cdfData).map(label => (
              <Line
                key={label}
                type='monotone'
                dataKey={label}
                stroke={COLORS[label as OperatorLabel]}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
