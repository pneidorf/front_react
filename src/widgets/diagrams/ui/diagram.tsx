import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend, // Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import { useFetchDiagrams } from '~/entities/diagrams/api/fetchDiagrams'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className='custom-tooltip'
        style={{ background: '#fff', padding: '10px', border: '1px solid #ccc' }}
      >
        <p>{`Приложение: ${label}`}</p>
        <p>{`Количество трафика, байт: ${payload[0].value}`}</p>
        <p>{`Мобильные данные: ${payload[0].payload.MobileBytes}`}</p>
        <p>{`Wi-Fi данные: ${payload[0].payload.WifiBytes}`}</p>
      </div>
    )
  }
  return null
}

export const Diagram = () => {
  const { data: diagramsData } = useFetchDiagrams()

  // const filteredData = diagramsData?.filter((_, index) => index % 80 === 0)

  return (
    <div className='diagram-block phone:max-w-[50rem] phone:w-[50%] phone:max-h-[50rem] phone:left-[15%]'>
      <div className='diagram-container-small phone:max-w-[50rem] phone:max-h-[50rem]'>
        {/* <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={diagramsData && diagramsData[0].TrafficData}>
            <Bar dataKey='TotalBytes' fill='#8884d8' />
          </BarChart>
        </ResponsiveContainer> */}
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            // width={500}
            // height={300}
            data={diagramsData && diagramsData[1].TrafficData}
            margin={{
              top: 0,
              right: 30,
              left: 20,
              bottom: 70
            }}
            barSize={50}
          >
            <XAxis
              dataKey='AppName'
              scale='auto'
              padding={{
                left: 25,
                right: 0
              }}
              dy={2}
              interval={0} // Показываем все подписи
              angle={-30} // Угол поворота подписей для улучшения читаемости
              textAnchor='end' // Размещаем текст по правому краю
            />
            <Legend verticalAlign='top' align='center' />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />

            <CartesianGrid strokeDasharray='3 3' />
            <Bar
              name={'Количество трафика, байт'}
              dataKey='TotalBytes'
              fill='#8884d8'
              background={{
                fill: '#eee'
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
