
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { InjectedConnector } from '@web3-react/injected-connector';

const injected = new InjectedConnector({ supportedChainIds: [1, 250, 137] });

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    try {
      const prov = new ethers.providers.Web3Provider(window.ethereum);
      await prov.send('eth_requestAccounts', []);
      const signer = prov.getSigner();
      const addr = await signer.getAddress();
      setProvider(prov);
      setAccount(addr);
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  const swapTokens = async () => {
    const contractAddress = 'YOUR_CONTRACT_ADDRESS';
    const contractABI = [/* ABI from compiled contract */];

    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const amountIn = ethers.utils.parseUnits('1.0', 6);
    const amountOutMin = 0;
    const path = ['USDC_ADDRESS', 'OTHER_TOKEN_ADDRESS'];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    await contract.swapTokens(amountIn, amountOutMin, path, deadline);
  };

  return (
    <div className="App">
      <h1>Cross-Chain USDC DEX</h1>
      <button onClick={connectWallet}>
        {account ? `Connected: ${account}` : 'Connect Wallet'}
      </button>
      <button onClick={swapTokens}>Swap Tokens</button>
    </div>
  );
}

export default App;
