import React, { createContext, useContext, useState, useEffect } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

const AccountContext = createContext();

const AccountProvider = ({ appName, children }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        await web3Enable(appName);
        const injectedAccounts = await web3Accounts();
        setAccounts(injectedAccounts);
        if (injectedAccounts.length > 0 && !selectedAccount) {
          // Set the first account as the selected account initially
          setSelectedAccount(injectedAccounts[0]);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, [selectedAccount]);

  const handleAccountChange = (account) => {
    setSelectedAccount(account);
  };

  return (
    <AccountContext.Provider value={{ selectedAccount, setSelectedAccount }}>
      <div>
        {accounts.length > 0 ? (
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
