import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import SelectionPanel from './components/SelectionPanel';
import MapView from './components/MapView';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import './App.css';

// Componente para proteger rotas privadas
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const [selectedOption, setSelectedOption] = useState(null);
  
  const handleSelectChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública principal */}
        <Route path="/" element={
          <Layout>
            <div className="flex flex-col md:flex-row w-full gap-4 h-[calc(100vh-150px)]">
              <SelectionPanel onSelectChange={handleSelectChange} />
              <MapView selectedOption={selectedOption} />
            </div>
          </Layout>
        } />
        
        {/* Outras rotas públicas */}
        <Route path="/mapa" element={<Layout><div>Página do Mapa</div></Layout>} />
        <Route path="/sobre" element={<Layout><div>Página Sobre</div></Layout>} />
        <Route path="/contato" element={<Layout><div>Página de Contato</div></Layout>} />
        
        {/* Rotas de autenticação (públicas) */}
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        
        {/* Rotas privadas (protegidas) */}
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute>
              <Layout><Dashboard /></Layout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/admin/locations" 
          element={
            <PrivateRoute>
              <Layout><div>Gerenciar Estabelecimentos</div></Layout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/admin/demands" 
          element={
            <PrivateRoute>
              <Layout><div>Gerenciar Demandas</div></Layout>
            </PrivateRoute>
          } 
        />
        
        {/* Rota para casos não encontrados */}
        <Route path="*" element={<Layout><div>Página não encontrada</div></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;