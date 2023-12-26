import React, { useState } from 'react';
import { useSubstrate } from './SubstrateContext';
import { useAccount } from './AccountContext';
import { web3FromAddress } from '@polkadot/extension-dapp';

const Remark = () => {
  const { api } = useSubstrate();
  const { selectedAccount } = useAccount();
  const [status, setStatus] = useState('');
  const [remark, setRemark] = useState('');

  const handleRemarkChange = (event) => {
    setRemark(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (api && selectedAccount && remark) {
        const { address } = selectedAccount;

        // Use the injected account for signing
        const injector = await web3FromAddress(address);

        const unsubscribe = await api.tx.system
          .remark(remark)
          .signAndSend(address, { signer: injector.signer }, ({ status }) => {
            setStatus(`Current status is ${status}`);

            if (status.isInBlock) {
              setStatus(
                `Transaction included at blockHash ${status.asInBlock}`
              );
            } else if (status.isFinalized) {
              setStatus(
                `Transaction finalized at blockHash ${status.asFinalized}`
              );
              unsubscribe();
            }
          });

        // Clear the remark field after submission
        setRemark('');
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  // Disable the component if there is no API or no selected account
  if (!api || !selectedAccount) {
    return (
      <div>
        <p>Please connect to the Polkadot extension and select an account.</p>
      </div>
    );
  }

  return (
    <div>
      <h4>Submit Remark</h4>
      <input
        placeholder="Enter your remark..."
        value={remark}
        onChange={handleRemarkChange}
      />
      <button onClick={handleSubmit}>Submit Remark</button>
      {status && <p>Status: {status}</p>}
    </div>
  );
};

export default Remark;
