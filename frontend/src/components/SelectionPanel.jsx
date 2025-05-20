import React, { useState, useEffect } from 'react';

const SelectionPanel = ({ onSelectChange }) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  // Simula busca de dados da API
  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        // Aqui você implementaria a chamada real para a API
        // Por enquanto, usamos dados simulados para problemas de saúde mental
        setTimeout(() => {
          const mockOptions = [
            { id: 1, name: 'Ansiedade', type: 'anxiety' },
            { id: 2, name: 'Depressão', type: 'depression' },
            { id: 3, name: 'Estresse', type: 'stress' },
            { id: 4, name: 'Transtorno Bipolar', type: 'bipolar' },
            { id: 5, name: 'Insônia', type: 'insomnia' },
            { id: 6, name: 'Transtorno de Pânico', type: 'panic' },
            { id: 7, name: 'TDAH', type: 'adhd' },
          ];
          setOptions(mockOptions);
          setIsLoading(false);
        }, 800); // Tempo reduzido para melhor experiência
      } catch (error) {
        console.error('Erro ao buscar opções:', error);
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    
    // Encontra a opção selecionada completa e passa para o componente pai
    const selectedObj = options.find(option => option.id.toString() === value);
    onSelectChange(selectedObj);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4 w-full md:w-96">
      <h2 className="text-xl font-bold text-gray-800">Saúde Mental em Santa Maria/RS</h2>
      <p className="text-gray-600">
        Selecione abaixo o problema de saúde mental que você precisa de ajuda e visualize no mapa as clínicas e profissionais disponíveis em Santa Maria.
      </p>
      
      <div className="mt-4">
        <label htmlFor="service-select" className="block text-sm font-medium text-gray-700 mb-1">
          Problema de saúde mental:
        </label>
        <select 
          id="service-select" 
          value={selectedOption} 
          onChange={handleChange}
          disabled={isLoading}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Selecione um problema</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        {isLoading && <p className="mt-2 text-sm text-blue-500">Carregando opções...</p>}
      </div>
    </div>
  );
};

export default SelectionPanel;
