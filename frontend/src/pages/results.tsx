// src/pages/results.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import api from '../api/api';
import { Location, Demand } from '../types';

// Carrega o componente do mapa dinamicamente para evitar erros de SSR
const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
});

export default function Results() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [demand, setDemand] = useState<Demand | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterNeighborhood, setFilterNeighborhood] = useState<string>('');
  const router = useRouter();
  const { demandId } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      if (!demandId) return;
      
      try {
        setIsLoading(true);
        
        // Busca os locais com base na demanda
        const locationsResponse = await api.get(`/locations?demandId=${demandId}`);
        setLocations(locationsResponse.data);
        
        // Busca os detalhes da demanda
        const demandResponse = await api.get(`/demands/${demandId}`);
        setDemand(demandResponse.data);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setIsLoading(false);
      }
    };

    if (demandId) {
      fetchData();
    }
  }, [demandId]);

  // Lista única de bairros para filtro
  const neighborhoods = Array.from(
    new Set(locations.map((location) => location.neighborhood))
  ).sort();

  // Filtra os locais por bairro
  const filteredLocations = filterNeighborhood
    ? locations.filter((location) => location.neighborhood === filterNeighborhood)
    : locations;

  const handleViewDetails = (locationId: number) => {
    router.push(`/location/${locationId}`);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>
          {demand ? `Onde encontrar: ${demand.name} - Saúde Certa` : 'Resultados - Saúde Certa'}
        </title>
        <meta
          name="description"
          content="Locais de atendimento encontrados para sua necessidade em Santa Maria/RS"
        />
      </Head>

      <div className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center text-white hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Voltar para busca
          </button>
        </div>
      </div>

      <main className="container mx-auto py-6 px-4">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-xl">Carregando resultados...</p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6">
              {demand && `Locais que oferecem: ${demand.name}`}
            </h1>

            {demand?.description && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p>{demand.description}</p>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Filtros</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Bairro</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded"
                      value={filterNeighborhood}
                      onChange={(e) => setFilterNeighborhood(e.target.value)}
                    >
                      <option value="">Todos os bairros</option>
                      {neighborhoods.map((neighborhood) => (
                        <option key={neighborhood} value={neighborhood}>
                          {neighborhood}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-xl font-semibold mb-4">Locais Encontrados</h2>
                  
                  {filteredLocations.length === 0 ? (
                    <p>Nenhum local encontrado com os filtros atuais.</p>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {filteredLocations.map((location) => (
                        <div
                          key={location.id}
                          className="border-b pb-4 last:border-b-0 last:pb-0"
                        >
                          <h3 className="font-semibold">{location.name}</h3>
                          <p className="text-gray-700 text-sm">
                            {location.address}, {location.neighborhood}
                          </p>
                          {location.phone && (
                            <p className="text-gray-700 text-sm">Tel: {location.phone}</p>
                          )}
                          <button
                            onClick={() => handleViewDetails(location.id)}
                            className="text-blue-600 text-sm hover:underline mt-2"
                          >
                            Ver detalhes
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow p-4 h-full">
                  <h2 className="text-xl font-semibold mb-4">Mapa</h2>
                  <div className="h-[500px]">
                    <Map locations={filteredLocations} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Saúde Certa - Santa Maria/RS</p>
        </div>
      </footer>
    </div>
  );
}
