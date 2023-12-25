import { SubstrateProvider } from './SubstrateContext';
import { AccountProvider } from './AccountContext';

function App() {
  return (
    <div>
      <AccountProvider>
        <SubstrateProvider providerUrl="wss://rpc.polkadot.io"></SubstrateProvider>
        <SubstrateProvider providerUrl="wss://kusama-rpc.polkadot.io"></SubstrateProvider>
      </AccountProvider>
    </div>
  );
}

export default App;
