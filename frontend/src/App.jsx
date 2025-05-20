import React from 'react';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <Layout>
      <div className="container">
        <h1>Saude Certa</h1>
        <div className="card">
          <p>
            Bem-vindo ao Saúde Certa Maps, sua plataforma para encontrar serviços de saúde próximos a você.
          </p>
          <p>
            Utilize nosso mapa interativo para localizar hospitais, clínicas, farmácias e outros estabelecimentos de saúde.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default App;
