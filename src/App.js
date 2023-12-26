import { SubstrateProvider } from './SubstrateContext';
import { AccountProvider } from './AccountContext';
import AccountBalance from './AccountBalance';
import BlockNumber from './BlockNumber';
import Remark from './Remark';

function App() {
  return (
    <div>
      <h1>Polkadot React Template</h1>
      <AccountProvider appName="polkadot-react-template">
        <SubstrateProvider providerUrl="wss://rpc.polkadot.io">
          <h2>Polkadot</h2>
          <BlockNumber />
          <AccountBalance />
          <Remark />
        </SubstrateProvider>
        <SubstrateProvider providerUrl="wss://kusama-rpc.polkadot.io">
          <h2>Kusama</h2>
          <BlockNumber />
          <AccountBalance />
          <Remark />
        </SubstrateProvider>
      </AccountProvider>
    </div>
  );
}

export default App;
