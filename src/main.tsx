import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { Root } from './app/root'
import './app/styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Root />
  </BrowserRouter>
)
