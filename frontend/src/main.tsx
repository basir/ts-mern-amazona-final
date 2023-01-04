import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import 'bootstrap/dist/css/bootstrap.min.css'
import { StoreProvider } from './Store'
import App from './App'
import './index.css'
import axios from 'axios'
axios.defaults.baseURL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : '/'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <PayPalScriptProvider
          options={{ 'client-id': 'sb' }}
          deferLoading={true}
        >
          <App />
        </PayPalScriptProvider>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
)
