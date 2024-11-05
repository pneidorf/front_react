import { useMutation } from '@tanstack/react-query'

import { api } from '~/shared/api'

export const useMutationLogin = () => useMutation({ mutationKey: ['login'], mutationFn: api.login })
