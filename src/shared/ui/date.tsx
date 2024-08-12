import { useEffect, useState } from 'react'

function formatDate(date: Date) {
  const optionsDate: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
  const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }

  const formattedDate = date.toLocaleDateString('ru-RU', optionsDate)
  const formattedTime = date.toLocaleTimeString('ru-RU', optionsTime)

  return `${formattedDate} ${formattedTime}`
}

export const CurrentDate = () => {
  const [date, setData] = useState<Date>(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setData(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return <p className='text-lg font-bold text-primary'>{formatDate(date)}</p>
}
