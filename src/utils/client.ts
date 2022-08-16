import axios from 'axios'
import { QueryClient } from 'react-query'

export const apiClient = axios.create({
  baseURL: '/api',
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})
