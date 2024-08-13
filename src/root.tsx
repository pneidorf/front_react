import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { App } from '~/app/app'
import { ThemeProvider } from '~/app/providers/theme-provider'
import '~/app/styles/globals.css'
import '~/shared/config/i18n'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <App />
    </ThemeProvider>
  </BrowserRouter>
)
