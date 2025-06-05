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
  
  // Estados para o formulário de demanda
  const [formDemand, setFormDemand] = useState({ id: null, name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [showDemandForm, setShowDemandForm] = useState(false);
  const [formError, setFormError] = useState('');

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

      // Definir a URL diretamente em vez de usar process.env
      const apiUrl = 'http://localhost:5001';

      // Tratar cada chamada separadamente com try/catch individual
      try {
        const locationsResponse = await axios.get(`${apiUrl}/api/locations`, config);
        setLocations(locationsResponse.data || []);
        console.log('Localizações carregadas:', locationsResponse.data);
      } catch (locError) {
        console.error('Erro ao carregar localizações:', locError);
        setLocations([]);
      }

      try {
        const demandsResponse = await axios.get(`${apiUrl}/api/demands`, config);
        if (demandsResponse && demandsResponse.data) {
          setDemands(demandsResponse.data);
          console.log('Demandas carregadas:', demandsResponse.data);
        } else {
          console.warn('Resposta de demandas vazia ou indefinida');
          setDemands([]);
        }
      } catch (demandError) {
        console.error('Erro ao carregar demandas:', demandError);
        setDemands([]);
      }
    } catch (error) {
      console.error('Erro geral ao carregar dados:', error);
      setLocations([]);
      setDemands([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Funções para gerenciar demandas
  const resetForm = () => {
    setFormDemand({ id: null, name: '', description: '' });
    setIsEditing(false);
    setFormError('');
  };

  const handleDemandChange = (e) => {
    const { name, value } = e.target;
    setFormDemand(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateDemand = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formDemand.name.trim()) {
      setFormError('O nome da demanda é obrigatório');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFormError('Sessão expirada. Por favor, faça login novamente.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      // Definir a URL diretamente
      const apiUrl = 'http://localhost:5001';
      console.log('API URL:', apiUrl);
      
      let response;
      if (isEditing) {
        console.log('Atualizando demanda:', formDemand);
        response = await axios.put(
          `${apiUrl}/api/demands/${formDemand.id}`,
          formDemand,
          config
        );
      } else {
        console.log('Criando demanda:', formDemand);
        response = await axios.post(
          `${apiUrl}/api/demands`,
          formDemand,
          config
        );
      }
      
      console.log('Resposta:', response.data);

      // Atualizar lista de demandas
      fetchData();
      resetForm();
      setShowDemandForm(false);
    } catch (error) {
      console.error('Erro ao salvar demanda:', error);
      
      if (error.response) {
        // O servidor respondeu com um status de erro
        console.error('Status do erro:', error.response.status);
        console.error('Dados do erro:', error.response.data);
        console.error('Status do erro:', error.response.status);
        setFormError(error.response.data.message || `Erro ${error.response.status}: Falha ao salvar demanda`);
        if (error.response.status === 401) {
          setFormError('Sessão expirada ou não autorizado. Por favor, faça login novamente.');
          setTimeout(() => navigate('/login'), 2000);
        }
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        console.error('Sem resposta do servidor:', error.request);
        setFormError('Erro de conexão com o servidor. Verifique sua internet.');
      } else {
        // Algo aconteceu na configuração da requisição
        setFormError('Erro ao preparar requisição: ' + error.message);
      }
    }
  };

  const handleEditDemand = (demand) => {
    setFormDemand({
      id: demand.id,
      name: demand.name,
      description: demand.description || ''
    });
    setShowDemandForm(true);
    setIsEditing(true);
  };

  const handleDeleteDemand = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta demanda?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Usar URL direta em vez de process.env
      const apiUrl = 'http://localhost:5001';
      await axios.delete(`${apiUrl}/api/demands/${id}`, config);
      fetchData();
    } catch (error) {
      console.error('Erro ao excluir demanda:', error);
      alert(error.response?.data?.message || 'Erro ao excluir demanda');
    }
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
          <button onClick={() => setShowDemandForm(!showDemandForm)}>
            {showDemandForm ? 'Cancelar' : 'Nova Demanda'}
          </button>
        </div>
        
        {showDemandForm && (
          <div className="demand-form-container">
            {formError && <div className="error-message">{formError}</div>}
            <h3>{isEditing ? 'Editar Demanda' : 'Nova Demanda'}</h3>
            <form onSubmit={handleCreateDemand}>
              <div className="form-group">
                <label htmlFor="name">Nome da Demanda</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formDemand.name}
                  onChange={handleDemandChange}
                  required
                  style={{ backgroundColor: 'white', color: 'black' }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  name="description"
                  value={formDemand.description}
                  onChange={handleDemandChange}
                  rows="3"
                  style={{ backgroundColor: 'white', color: 'black' }}
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="save-btn">
                  {isEditing ? 'Atualizar' : 'Salvar'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => {setShowDemandForm(false); resetForm();}}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="dashboard-summary">
          <div className="summary-card">
            <p className="count">{locations.length}</p>
            <h3>Estabelecimentos</h3>
          </div>
          <div className="summary-card">
            <p className="count">{demands.length}</p>
            <h3>Demandas</h3>
          </div>
        </div>
        
        <div className="demands-list">
          <h3>Lista de Demandas</h3>
          {demands.length === 0 ? (
            <p>Nenhuma demanda cadastrada.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {demands.map(demand => (
                  <tr key={demand.id}>
                    <td>{demand.name}</td>
                    <td>{demand.description || '-'}</td>
                    <td>
                      <button 
                        onClick={() => handleEditDemand(demand)}
                        className="edit-btn"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDeleteDemand(demand.id)}
                        className="delete-btn"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;