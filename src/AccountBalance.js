import React, { useEffect, useState } from 'react';
import { useSubstrate } from './SubstrateContext';
import { useAccount } from './AccountContext';

const AccountBalance = () => {
  const { api } = useSubstrate();
  const { selectedAccount } = useAccount();
  const [balances, setBalances] = useState(null);
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

    const fetchBalances = async () => {
      try {
        if (api && selectedAccount) {
          const { address } = selectedAccount;
          // Subscribe to balance changes
          const unsubscribe = await api.derive.balances.all(
            address,
            (result) => {
              setBalances(result);
            }
          );

          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching account balances:', error);
      }
    };

    fetchTokenInfo();
    fetchBalances();
  }, [api, selectedAccount]);

  // Calculate the total balance
  const calculateTotalBalance = () => {
    if (balances) {
      const { freeBalance, reservedBalance } = balances;
      return freeBalance.add(reservedBalance);
    }
    return null;
  };

  const formattedBalance = (value) =>
    value !== null
      ? (parseFloat(value) / 10 ** tokenInfo.decimals).toFixed(4)
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
        <div>
          <p>
            <strong>Address:</strong> {formattedAddress()}
          </p>
          <div>
            <strong>Total Balance:</strong>{' '}
            {formattedBalance(calculateTotalBalance())} {tokenInfo.name}
            <ul>
              <li>
                Reserved: {formattedBalance(balances?.reservedBalance)}{' '}
                {tokenInfo.name}
              </li>
              <li>
                Free: {formattedBalance(balances?.freeBalance)} {tokenInfo.name}
              </li>
              <ul>
                <li>
                  Locked: {formattedBalance(balances?.lockedBalance)}{' '}
                  {tokenInfo.name}
                </li>
                <li>
                  Available: {formattedBalance(balances?.availableBalance)}{' '}
                  {tokenInfo.name}
                </li>
              </ul>
            </ul>
          </div>
        </div>
      ) : (
        <p>No account selected.</p>
      )}
    </div>
  );
};

export default AccountBalance;
