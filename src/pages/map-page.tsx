import { memo } from 'react'

import { Map } from '~/widgets/map'
import { MapDeck } from '~/widgets/map/ui/mapDeck'

export const MapPage = memo(() => (
  <div className='h-full w-full'>
    {/* <Map /> */}
    <MapDeck />
  </div>
))
