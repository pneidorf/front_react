import { memo } from 'react'

import { Map } from '~/widgets/map'

export const MapPage = memo(() => (
  <div className='h-full w-full'>
    <Map />
  </div>
))
