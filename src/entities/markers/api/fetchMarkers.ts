// import { useQuery } from '@tanstack/react-query'
// import { api } from '~/shared/api'
// export const useFetchMarkers = () =>
//   useQuery({ queryKey: ['markers'], queryFn: api.getRSRPQuality })
import { useQuery } from '@tanstack/react-query'

import { api } from '~/shared/api'

export const useFetchMarkers = (timestart: string, timeend: string) =>
  useQuery({
    queryKey: ['markers', timestart, timeend],
    queryFn: () => api.getRSRPQuality(timestart, timeend),
    enabled: !!timestart && !!timeend
  })
