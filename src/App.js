import { SubstrateProvider } from './SubstrateContext';
import { AccountProvider } from './AccountContext';
import BlockNumber from './BlockNumber';

function App() {
  return (
    <div>
      <h2>Polkadot React Template</h2>
      <AccountProvider>
        <SubstrateProvider providerUrl="wss://rpc.polkadot.io">
          <h3>Polkadot</h3>
          <BlockNumber />
        </SubstrateProvider>
        <SubstrateProvider providerUrl="wss://kusama-rpc.polkadot.io">
          <h3>Kusama</h3>
          <BlockNumber />
        </SubstrateProvider>
      </AccountProvider>
    </div>
  );
}

export default App;
