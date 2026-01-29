import React, { useState } from 'react';
import Layout from './components/Layout';
// Components
import Dashboard from './components/Dashboard';
import Historial from './components/Historial';
import Reportes from './components/Reportes';
import Stock from './components/Stock';
import Configuracion from './components/Configuracion';
import Personal from './components/Personal';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'movimientos':
        return <Historial />;
      case 'stock':
        return <Stock />;
      case 'personal':
        return <Personal />;
      case 'reportes':
        return <Reportes />;
      case 'configuracion':
        return <Configuracion />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
