import React, { createContext, useContext, useState, useEffect } from 'react';
import { WsProvider, ApiPromise } from '@polkadot/api';

const SubstrateContext = createContext();

const SubstrateProvider = ({ children, providerUrl }) => {
  const [api, setApi] = useState(null);

  useEffect(() => {
    const connectToSubstrate = async () => {
      try {
        const provider = new WsProvider(providerUrl);
        const substrateApi = await ApiPromise.create({ provider });
        setApi(substrateApi);
      } catch (error) {
        console.error('Error connecting to Substrate:', error);
      }
    };

    connectToSubstrate();
  }, [providerUrl]);

  const contextValue = {
    api,
  };

  return (
    <SubstrateContext.Provider value={contextValue}>
      {children}
    </SubstrateContext.Provider>
  );
};

const useSubstrate = () => {
  const context = useContext(SubstrateContext);
  if (!context) {
    throw new Error('useSubstrate must be used within a SubstrateProvider');
  }
  return context;
};

export { SubstrateProvider, useSubstrate };
