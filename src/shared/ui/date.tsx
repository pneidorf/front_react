import { type i18n } from 'i18next'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

function formatDate(date: Date, i18n: i18n) {
  const optionsDate: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
  const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }

  const formattedDate = date.toLocaleDateString(
    `${i18n.language}-${i18n.language.toUpperCase()}`,
    optionsDate
  )
  const formattedTime = date.toLocaleTimeString(
    `${i18n.language}-${i18n.language.toUpperCase()}`,
    optionsTime
  )

  return `${formattedDate} ${formattedTime}`
}

export const CurrentDate = () => {
  const [date, setData] = useState<Date>(new Date())
  const { i18n } = useTranslation()

  useEffect(() => {
    const interval = setInterval(() => {
      setData(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <p className='phone:text-[0.8rem] text-lg font-bold text-primary'>{formatDate(date, i18n)}</p>
  )
}
