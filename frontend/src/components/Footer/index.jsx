import React from 'react';
import './styles.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Saúde Certa Maps</h3>
            <p>Encontre o serviço de saúde mais próximo de você.</p>
          </div>
          
          <div className="footer-section">
            <h3>Links Rápidos</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/mapa">Mapa</a></li>
              <li><a href="/sobre">Sobre</a></li>
              <li><a href="/contato">Contato</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contato</h3>
            <p>contato@saudecertamaps.com.br</p>
            <p>(11) 99999-9999</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Saúde Certa Maps. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
