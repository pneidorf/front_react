import { useQuery } from '@tanstack/react-query'

import { api } from '~/shared/api'

export const useFetchDiagrams = () =>
  useQuery({ queryKey: ['diagrams'], queryFn: api.getAppTraffic })
