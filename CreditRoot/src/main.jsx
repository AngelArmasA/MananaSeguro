// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PollarProvider } from '@pollar/react'
import App from './App'
import './i18n/index.js'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PollarProvider config={{ apiKey: import.meta.env.VITE_POLLAR_KEY }}>
        <App />
      </PollarProvider>
    </BrowserRouter>
  </StrictMode>
)