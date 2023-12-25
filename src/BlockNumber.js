import React, { useEffect, useState } from 'react';
import { useSubstrate } from './SubstrateContext';

const BlockNumber = () => {
  const { api } = useSubstrate();
  const [blockNumber, setBlockNumber] = useState(null);

  useEffect(() => {
    // Subscribe to new blocks
    const subscribeNewHeads = async () => {
      try {
        if (api) {
          // Subscribe to new blocks
          const unsubscribe = await api.rpc.chain.subscribeNewHeads(
            (header) => {
              setBlockNumber(header.number.toNumber());
            }
          );

          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error subscribing to block number:', error);
      }
    };

    subscribeNewHeads();
  }, [api]);

  return (
    <div>
      {blockNumber !== null ? (
        <p>Latest Block Number: {blockNumber}</p>
      ) : (
        <p>Fetching block number...</p>
      )}
    </div>
  );
};

export default BlockNumber;
