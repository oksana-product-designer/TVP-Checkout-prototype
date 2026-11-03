import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/global.css'
import App from './App.jsx'
import { OrderProvider } from './state/OrderContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OrderProvider>
      <App />
    </OrderProvider>
  </StrictMode>,
)
