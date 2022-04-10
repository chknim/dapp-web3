import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';

    // WARNING: this is a dummy contract address generated on local network after deploying our code.
    // Ideally the address must not be used outside of this testing environment on local network.
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export default function App() {
  const [greeting, setGreetingValue] = useState();
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      fetchGreetings();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGreetings = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      Greeter.abi,
      provider
    );

    const data = await contract.greet();
    if (data !== greeting) {
      setGreetingValue(data);
    }
    console.log(data);
  };

  const setGreeting = async () => {
    if (!greeting) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        Greeter.abi,
        signer
      );
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreetings}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
      </header>
      <div>{greeting}</div>
    </div>
  );
}
