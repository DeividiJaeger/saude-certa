import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [locations, setLocations] = useState([]);
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(storedUser));
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [locationsResponse, demandsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/locations`, config),
        axios.get(`${process.env.REACT_APP_API_URL}/api/demands`, config)
      ]);

      setLocations(locationsResponse.data);
      setDemands(demandsResponse.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Painel Administrativo</h1>
        <div className="user-info">
          <span>Olá, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-menu">
          <button onClick={() => navigate('/admin/locations')}>
            Gerenciar Estabelecimentos
          </button>
          <button onClick={() => navigate('/admin/demands')}>
            Gerenciar Demandas
          </button>
        </div>
        
        <div className="dashboard-summary">
          <div className="summary-card">
            <h3>Estabelecimentos</h3>
            <p className="count">{locations.length}</p>
          </div>
          
          <div className="summary-card">
            <h3>Demandas</h3>
            <p className="count">{demands.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
