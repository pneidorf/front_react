import { memo } from 'react'
import { useTranslation } from 'react-i18next'

export const MainPage = memo(() => {
  const { t } = useTranslation('main')

  return <div className='pl-6'>{t('welcome')}</div>
})

// export const MainPage = memo(() => <div className='pl-6'>welcome</div>)
