import React, { createContext, useContext, useState } from 'react';
import { web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp';

const AccountContext = createContext();

const AccountProvider = ({ appName, children }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const connectAccounts = async () => {
    try {
      await web3Enable(appName);
      const unsubscribe = await web3AccountsSubscribe((injectedAccounts) => {
        setAccounts(injectedAccounts);
        if (injectedAccounts.length > 0 && !selectedAccount) {
          // Set the first account as the selected account initially
          setSelectedAccount(injectedAccounts[0]);
        }
      });

      setIsConnected(true);
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleAccountChange = (account) => {
    setSelectedAccount(account);
  };

  return (
    <AccountContext.Provider value={{ selectedAccount, setSelectedAccount }}>
      <div>
        {!isConnected ? (
          <button onClick={connectAccounts}>
            Connect to Polkadot Extension
          </button>
        ) : accounts.length > 0 ? (
          <div>
            <label>
              Select Account:
              <select>
                {accounts.map((account) => (
                  <option
                    key={account.address}
                    value={account.address}
                    onClick={() => handleAccountChange(account)}
                  >
                    {account.meta.name} - {account.address}
                  </option>
                ))}
              </select>
            </label>
            <p>
              <strong>Selected Account:</strong>{' '}
              {selectedAccount ? selectedAccount.address : 'None'}
            </p>
          </div>
        ) : (
          <p>
            No accounts found. Make sure the Polkadot extension is installed and
            unlocked.
          </p>
        )}
      </div>
      {children}
    </AccountContext.Provider>
  );
};

const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};

export { AccountProvider, useAccount };
