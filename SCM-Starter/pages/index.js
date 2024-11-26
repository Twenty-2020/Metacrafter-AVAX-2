import { useState, useEffect } from "react";
import { ethers } from "ethers";
import musicStoreABI from "../artifacts/contracts/Assessment.sol/MusicStore.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [musicStore, setMusicStore] = useState(undefined);
  const [albumPrice, setAlbumPrice] = useState(undefined);
  const [albumStock, setAlbumStock] = useState(undefined);
  const [albumSold, setAlbumSold] = useState(undefined);
  const [purchases, setPurchases] = useState(undefined);
  const [isSubscriber, setIsSubscriber] = useState(false);

  const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; 
  const musicStoreABIInterface = musicStoreABI.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account && account.length > 0) {
      console.log("Account connected: ", account[0]);
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getMusicStoreContract();
  };

  const getMusicStoreContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const musicStoreContract = new ethers.Contract(
      contractAddress,
      musicStoreABIInterface,
      signer
    );

    setMusicStore(musicStoreContract);
  };

  const fetchContractData = async () => {
    if (musicStore) {
      setAlbumPrice(ethers.utils.formatEther(await musicStore.albumPrice()));
      setAlbumStock((await musicStore.albumStock()).toNumber());
      setAlbumSold((await musicStore.albumSold()).toNumber());
      const subscriberStatus = await musicStore.subscribers(account);
      setIsSubscriber(subscriberStatus);
      const userPurchases = (await musicStore.purchases(account)).toNumber();
      setPurchases(userPurchases);
    }
  };

  const subscribe = async () => {
    if (musicStore) {
      try {
        const tx = await musicStore.subscribe({ value: ethers.utils.parseEther("0.001") });
        await tx.wait();
        fetchContractData();
        alert("Subscription successful!");
      } catch (err) {
        console.error(err);
        alert("Subscription failed!");
      }
    }
  };

  const purchaseAlbum = async () => {
    if (musicStore) {
      try {
        const tx = await musicStore.purchase({ value: ethers.utils.parseEther(albumPrice) });
        await tx.wait();
        fetchContractData();
        alert("Album purchased successfully!");
      } catch (err) {
        console.error(err);
        alert("Purchase failed!");
      }
    }
  };

  const refundAlbum = async () => {
    if (musicStore) {
      try {
        const tx = await musicStore.refund();
        await tx.wait();
        fetchContractData();
        alert("Refund successful!");
      } catch (err) {
        console.error(err);
        alert("Refund failed!");
      }
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this MusicStore.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your MetaMask wallet</button>;
    }

    if (albumPrice === undefined || albumStock === undefined || albumSold === undefined) {
      fetchContractData();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Album Price: {albumPrice} ETH</p>
        <p>Album Stock: {albumStock}</p>
        <p>Albums Sold: {albumSold}</p>
        <p>Your Purchases: {purchases}</p>
        <p>Subscriber Status: {isSubscriber ? "Yes" : "No"}</p>
        {!isSubscriber && <button onClick={subscribe}>Subscribe (0.001 ETH)</button>}
        {isSubscriber && albumStock > 0 && (
          <button onClick={purchaseAlbum}>Purchase Album ({albumPrice} ETH)</button>
        )}
        {isSubscriber && purchases > 0 && <button onClick={refundAlbum}>Refund Album</button>}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the MusicStore!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}