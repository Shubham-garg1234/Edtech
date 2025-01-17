import { createRoot } from 'react-dom/client'
import App from './App.js'
import './index.css'
import { AuthProvider } from './AuthContext.js';

createRoot(document.getElementById("root")!).render(
    <AuthProvider>
        <App />
    </AuthProvider>,
);
