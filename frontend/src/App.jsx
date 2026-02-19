import { useState } from 'react';
import './index.css';
import IEEE754Converter from './components/IEEE754Converter';
import MIL1553Tool from './components/MIL1553Tool';
import SpaceWireTool from './components/SpaceWireTool';
import CANTool from './components/CANTool';
import GenericDecommutator from './components/GenericDecommutator';
import TimeConverter from './components/TimeConverter';

function App() {
  const [activeTab, setActiveTab] = useState('ieee754');

  return (
    <div className="container">
      <h1>MySwissToolbox</h1>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'ieee754' ? 'active' : ''}`}
          onClick={() => setActiveTab('ieee754')}
        >
          IEEE 754
        </button>
        <button
          className={`tab ${activeTab === 'mil1553' ? 'active' : ''}`}
          onClick={() => setActiveTab('mil1553')}
        >
          MIL-STD-1553
        </button>
        <button
          className={`tab ${activeTab === 'spw' ? 'active' : ''}`}
          onClick={() => setActiveTab('spw')}
        >
          SpaceWire
        </button>
        <button
          className={`tab ${activeTab === 'can' ? 'active' : ''}`}
          onClick={() => setActiveTab('can')}
        >
          CAN Bus
        </button>
        <button
          className={`tab ${activeTab === 'generic' ? 'active' : ''}`}
          onClick={() => setActiveTab('generic')}
        >
          Decommutator
        </button>
        <button
          className={`tab ${activeTab === 'time' ? 'active' : ''}`}
          onClick={() => setActiveTab('time')}
        >
          Time
        </button>
      </div>

      <div className="content">
        {activeTab === 'ieee754' && <IEEE754Converter />}
        {activeTab === 'mil1553' && <MIL1553Tool />}
        {activeTab === 'spw' && <SpaceWireTool />}
        {activeTab === 'can' && <CANTool />}
        {activeTab === 'generic' && <GenericDecommutator />}
        {activeTab === 'time' && <TimeConverter />}
      </div>
    </div>
  );
}

export default App;
