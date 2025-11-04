import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from './store/store'
import 'bootstrap/dist/css/bootstrap.min.css'
import './i18n'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { initProfanity } from './utils/profanity'
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react'

initProfanity()

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_TOKEN,
  environment: 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
}

const toastProps = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
}

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <BrowserRouter>
            <App />
            <ToastContainer {...toastProps} />
          </BrowserRouter>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  </React.StrictMode>,
)
