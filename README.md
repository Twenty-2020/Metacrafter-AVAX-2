# Metacrafter-AVAX-2

This Solidity code demonstrates an example front end and back end interaction between a solidity contract and javascript.

## Description

The code is written in Solidity and Javascript. The contract contains functions for subscribing, purchasing an album, and refunding an album. The program serves as a good introduction to Solidity programming, through the use of require, assert, and reverse functions. Additionally, the program serves as an introduction to how a front end and back end interacts in the blockchain.

### Executing program
First, ensure you have Node.js and MetaMask installed on your computer. Clone the project repository to your local machine, then open a terminal and navigate to the project directory. Run npm install to install all necessary dependencies. Next, set up a local blockchain by running npx hardhat node in one terminal window, which will start a local Ethereum network. In a separate terminal, deploy the smart contract by running npx hardhat run scripts/deploy.js --network localhost. Copy the deployed contract address and update the contractAddress in your React component. Then, configure MetaMask to connect to the local blockchain by adding a new network with RPC URL http://127.0.0.1:8545/ and chain ID 31337. Import one of the local blockchain accounts into MetaMask by using the private key provided in the hardhat node output. Start the React development server by running npm run dev. Open your browser and navigate to http://localhost:3000. Click "Connect Wallet" in the application, select the imported MetaMask account, and you should now be able to interact with the Music Store contract.

Once you can interact with the contract, you must connect your metamask account. After connecting the account you can then proceed to subscription, which will allow you to use the remaining functions. After subcribing you can then proceed to buying albums as well as refunding them.


## Authors
TWENTY-2020

## License
This project is licensed under the MIT License - see the LICENSE.md file for details


