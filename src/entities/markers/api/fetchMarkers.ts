import { useQuery } from '@tanstack/react-query'

import { api } from '~/shared/api'

export const useFetchMarkers = () =>
  useQuery({ queryKey: ['markers'], queryFn: api.getRSRPQuality })
