import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { App } from '~/app/app'
import { ThemeProvider } from '~/app/providers/theme-provider'
import '~/app/styles/globals.css'
import '~/shared/config/i18n'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
)
