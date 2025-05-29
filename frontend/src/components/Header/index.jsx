import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Saúde Certa Maps</h1>
        </div>
        <nav className="navigation">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/sobre">Sobre</Link></li>
            <li><Link to="/contato">Contato</Link></li>
          
            {isAuthenticated ? (
              <>
                <li><Link to="/admin/dashboard">Dashboard</Link></li>
                <li><button onClick={handleLogout} className="logout-btn">Sair</button></li>
              </>
            ) : (
              <li><Link to="/login" className="login-btn">Acesso ao sistema</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
