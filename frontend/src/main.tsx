import { createRoot } from 'react-dom/client'
import App from './App.js'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.js';
import { CartProvider } from './contexts/CartContext.js';
import { CourseProvider } from './contexts/CourseContext.js';

createRoot(document.getElementById("root")!).render(
    <AuthProvider>
        <CartProvider>
            <CourseProvider>
                <App />
            </CourseProvider>
        </CartProvider>
    </AuthProvider>
);
