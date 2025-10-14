import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ConversationProvider } from './context/ConversationContext'
import App from './App'
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ConversationProvider>
          <App />
        </ConversationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
