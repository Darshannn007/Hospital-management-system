import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './store/store.js'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'


createRoot(document.getElementById('root')).render(
    <Provider store={store}>
    <Toaster position="top-center" />
    <App />
  </Provider>
)
