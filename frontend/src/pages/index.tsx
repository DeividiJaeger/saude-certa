// src/pages/index.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import api from '../api/api';
import { Demand } from '../types';

export default function Home() {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [selectedDemand, setSelectedDemand] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDemands = async () => {
      try {
        const response = await api.get('/demands');
        setDemands(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar demandas:', error);
        setIsLoading(false);
      }
    };

    fetchDemands();
  }, []);

  const handleSearch = () => {
    if (selectedDemand) {
      router.push(`/results?demandId=${selectedDemand}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Saúde Certa - Santa Maria/RS</title>
        <meta name="description" content="Encontre o local de atendimento ideal para suas necessidades de saúde em Santa Maria/RS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="bg-blue-600 text-white">
          <div className="container mx-auto py-16 px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Saúde Certa</h1>
            <p className="text-xl mb-8">
              Encontre o local ideal para atendimento de saúde em Santa Maria/RS
            </p>

            <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
              <h2 className="text-gray-800 font-semibold mb-4">Do que você precisa?</h2>
              
              {isLoading ? (
                <p className="text-gray-500">Carregando opções...</p>
              ) : (
                <>
                  <select
                    className="w-full p-2 border border-gray-300 rounded mb-4 text-gray-800"
                    value={selectedDemand || ''}
                    onChange={(e) => setSelectedDemand(Number(e.target.value) || null)}
                  >
                    <option value="">Selecione um tipo de atendimento</option>
                    {demands.map((demand) => (
                      <option key={demand.id} value={demand.id}>
                        {demand.name}
                      </option>
                    ))}
                  </select>

                  <button
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    onClick={handleSearch}
                    disabled={!selectedDemand}
                  >
                    Encontrar Atendimento
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto py-12 px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Como funciona</h2>
              <p className="mb-4">
                O Saúde Certa é uma plataforma que ajuda você a encontrar o local de atendimento
                ideal para suas necessidades de saúde em Santa Maria/RS.
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Selecione o tipo de atendimento que você precisa</li>
                <li>Veja no mapa os locais disponíveis</li>
                <li>Acesse informações detalhadas sobre cada local</li>
                <li>Dirija-se ao local mais conveniente para você</li>
              </ol>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4">Serviços Disponíveis</h2>
              <ul className="list-disc pl-5 space-y-2">
                {demands.slice(0, 5).map((demand) => (
                  <li key={demand.id}>{demand.name}</li>
                ))}
                {demands.length > 5 && <li>E outros...</li>}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Saúde Certa - Santa Maria/RS</p>
        </div>
      </footer>
    </div>
  );
}
