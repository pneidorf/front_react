import { memo } from 'react'

import { Map } from '~/entities/map'

export const MapPage = memo(() => (
  <div className='h-full w-full'>
    <Map />
  </div>
))
