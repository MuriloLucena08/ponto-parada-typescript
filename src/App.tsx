import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {Layout} from './components/Layout/Layout';
import {Login} from './pages/Login/Login';
import {MapPage} from './pages/Map/MapPage';
import {RegistrosPage} from './pages/Registros/RegistrosPage';
import {FormularioPage} from './pages/Formulario/FormularioPage';
import {SobrePage} from './pages/Sobre/SobrePage';
import { PontoProvider } from './context/PontoContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div>Loading...</div>; // Prevent redirect while checking auth
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
};

export function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <PontoProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />

                        <Route path="/" element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<MapPage />} />
                            <Route path="registros" element={<RegistrosPage />} />

                        </Route>

                        <Route path="/formulario" element={
                            <ProtectedRoute>
                                <FormularioPage />
                            </ProtectedRoute>
                        } />

                        <Route path="/sobre" element={
                            <ProtectedRoute>
                                <SobrePage />
                            </ProtectedRoute>
                        } />

                    </Routes>
                </PontoProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}


