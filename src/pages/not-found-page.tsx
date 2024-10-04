import { memo } from 'react'
import { useTranslation } from 'react-i18next'

// export const NotFoundPage = memo(() => <div>NotFoundPage</div>)

export const NotFoundPage = memo(() => {
  const { t } = useTranslation('main')

  return <div className='pl-6'>{t('notfound')}</div>
})
