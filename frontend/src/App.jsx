import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState("");
  const [shareName, setShareName] = useState("");
  const [cid, setCid] = useState("");
  const [price, setPrice] = useState("");
  const [myShares, setMyShares] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, _signer);
        
        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);
        const account = await _signer.getAddress();
        setCurrentAccount(account);
      } else {
        alert("Install MetaMask to continue.");
      }
    };

    init();
  }, []);

  const registerUser = async () => {
    try {
      const tx = await contract.addUser();
      await tx.wait();
      alert("Registered successfully!");
    } catch (error) {
      console.error(error);
      alert("Registration failed or already registered.");
    }
  };

  const buyShare = async () => {
    try {
      const tx = await contract.buyShare(shareName, parseInt(cid), parseInt(price));
      await tx.wait();
      alert("Share bought!");
    } catch (error) {
      console.error(error);
      alert("Transaction failed.");
    }
  };

  const fetchShares = async () => {
    try {
      const shares = await contract.getMyShares();
      setMyShares(shares);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Simple Demat App</h1>
      <p>Connected Account: {currentAccount}</p>

      <button onClick={registerUser}>Register</button>

      <h2>Buy Share</h2>
      <input
        type="text"
        placeholder="Share Name"
        value={shareName}
        onChange={(e) => setShareName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Company ID"
        value={cid}
        onChange={(e) => setCid(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={buyShare}>Buy</button>

      <h2>Your Shares</h2>
      <button onClick={fetchShares}>View My Shares</button>
      <ul>
        {myShares.map((share, index) => (
          <li key={index}>
            ID: {share.cid.toString()}, Name: {share.shareName}, Price: {share.price.toString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
