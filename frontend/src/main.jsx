import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/ContextProvider'; // Correct import

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* Use AuthProvider here as a wrapper */}
      <App />
    </AuthProvider>
  </StrictMode>
);
