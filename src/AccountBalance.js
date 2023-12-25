import React, { useEffect, useState } from 'react';
import { useSubstrate } from './SubstrateContext';
import { useAccount } from './AccountContext';

const AccountBalance = () => {
  const { api } = useSubstrate();
  const { selectedAccount } = useAccount();
  const [balance, setBalance] = useState(null);
  const [tokenInfo, setTokenInfo] = useState({ name: 'UNITS', decimals: 12 });

  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        if (api) {
          const chainInfo = await api.registry.getChainProperties();
          setTokenInfo({
            name: chainInfo.tokenSymbol.value[0].toString(),
            decimals: chainInfo.tokenDecimals.value[0].toNumber(),
          });
        }
      } catch (error) {
        console.error('Error fetching token information:', error);
      }
    };

    const fetchBalance = async () => {
      try {
        if (api && selectedAccount) {
          const { address } = selectedAccount;
          // Subscribe to balance changes
          const unsubscribe = await api.query.system.account(
            address,
            ({ data: { free } }) => {
              setBalance(free.toString());
            }
          );

          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching account balance:', error);
      }
    };

    fetchTokenInfo();
    fetchBalance();
  }, [api, selectedAccount]);

  // Format the balance with correct decimal places
  const formattedBalance =
    balance !== null
      ? (parseFloat(balance) / 10 ** tokenInfo.decimals).toFixed(4)
      : 'Loading Balance...';

  const formattedAddress = () => {
    if (selectedAccount !== null && selectedAccount.address !== null)
      if (api !== null) {
        // Format the address with proper SS58
        return api.createType('Address', selectedAccount.address).toString();
      }

    return 'Loading Address...';
  };

  return (
    <div>
      {selectedAccount ? (
        <p>
          <strong>Address:</strong> {formattedAddress()}
          <br />
          <strong>Balance:</strong> {formattedBalance} {tokenInfo.name}
        </p>
      ) : (
        <p>No account selected.</p>
      )}
    </div>
  );
};

export default AccountBalance;
