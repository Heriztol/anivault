import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { MyListProvider } from './context/MyListContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MyListProvider>
        <App />
      </MyListProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
