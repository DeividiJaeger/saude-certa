import React, { useState } from 'react';
import Layout from './components/Layout';
import SelectionPanel from './components/SelectionPanel';
import MapView from './components/MapView';
import './App.css';

function App() {
  const [selectedOption, setSelectedOption] = useState(null);
  
  const handleSelectChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row w-full gap-4 h-[calc(100vh-150px)]">
        <SelectionPanel onSelectChange={handleSelectChange} />
        <MapView selectedOption={selectedOption} />
      </div>
    </Layout>
  );
}

export default App;
