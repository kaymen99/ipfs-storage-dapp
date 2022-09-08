<div id="top"></div>

<!-- ABOUT THE PROJECT -->
## IPFS storage Dapp


![Capture d’écran 2022-01-23 à 13 28 21](https://user-images.githubusercontent.com/83681204/150874956-c01456cf-0390-42b8-b72c-37bf5471aa17.png)


This is a decentralized application built on the Ethereum/Polygon blockchain, it works like Dropbox or Google Drive by allowing users to securely store their files on the blockchain using IPFS Technology

### Built With

* [Solidity](https://docs.soliditylang.org/)
* [Brownie](https://eth-brownie.readthedocs.io)
* [React.js](https://reactjs.org/)
* [ethers.js](https://docs.ethers.io/v5/)
* [web3modal](https://github.com/Web3Modal/web3modal)
* [material ui](https://mui.com/getting-started/installation/)


<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#contracts">Contracts</a></li>
        <li><a href="#scripts">Scripts</a></li>
        <li><a href="#testing">Testing</a></li>
        <li><a href="#front-end">Front End</a></li>
      </ul>
    </li>
    <li><a href="#resources">Resources</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>


<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

Please install or have installed the following:
* [nodejs and npm](https://nodejs.org/en/download/) 
* [python](https://www.python.org/downloads/)
* [MetaMask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) Chrome extension installed in your browser

### Installation

1. Installing Brownie: Brownie is a python framework for smart contracts development,testing and deployments. It's quit like [HardHat](https://hardhat.org) but it uses python for writing test and deployements scripts instead of javascript.
   Here is a simple way to install brownie.
   ```
    pip install --user pipx
    pipx ensurepath
    # restart your terminal
    pipx install eth-brownie
   ```
   Or if you can't get pipx to work, via pip (it's recommended to use pipx)
    ```
    pip install eth-brownie
    ```
   Install [ganache-cli](https://www.npmjs.com/package/ganache-cli): 
   ```sh
    npm install -g ganache-cli
    ```
   
3. Clone the repo:
   ```sh
   git clone https://github.com/kaymen99/ipfs-storage-dapp.git
   cd ipfs-storage-dapp
   ```
3. Install Ganache:
   Ganache is a local blockchain that run on your machine, it's used during development stages because it allows quick smart contract testing and avoids all real         Testnets problems. 
   You can install ganache from this link : https://trufflesuite.com/ganache/
   
   Next, you need to setup the ganache network with brownie :
   ```sh
   cd ipfs-storage-dapp
   brownie networks add Ethereum ganache-local host=http://127.0.0.1:7545 chainid=5777
   ```
4. Set your environment variables
   To be able to deploy to real Polygon testnets you need to add your PRIVATE_KEY (You can find your PRIVATE_KEY from your ethereum wallet like metamask) to the .env file:
   ```
   PRIVATE_KEY=<PRIVATE_KEY>
   ```
   In this project i used the Polygon Testnet but you can choose to use ethereum testnets like rinkeby, Kovan.
   
   To setup the Polygon Testnet with brownie you'll need an Alchemy account (it's free) and just create a new app on the polygon network
   
   ![Capture d’écran 2022-01-25 à 00 14 44](https://user-images.githubusercontent.com/83681204/150881084-9b60349e-def0-44d2-bbb2-8ca7e27157c7.png)
   
   
   After creating the app copy the URL from -view key- and run this: 
   ```sh
   cd ipfs-storage-dapp
   brownie networks add Polygon polygon-mumbai host=<Copied URL> chainid=80001 name="Mumbai Testnet (Alchemy)"
   ```
   
   You'll also need testnet MATIC. You can get MATIC into your wallet by using the Polygon testnet faucets located [here](https://faucet.polygon.technology). 


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

### Contracts

   In the ipfs-storage-dapp folder you'll find a directory contracts, all the smart contracts build in brownie are stored there. The FileStorage contract is the core of this application, it plays the role of the backend and has the following features:

  <ul>
    <li><b>SetUploadFee:</b> for every file uploaded the user must pay a small fee set by the owner of the contract</li>
    <li><b>Upload:</b> allows the user to upload his file </li>
    <li><b>getUserFiles:</b> a function for getting all the files uploaded by a given user </li>
    <li><b>Chainlink Price Feed:</b> the contract uses the price feed provided by chainlink oracle for converting the fee set by the owner from $ to MATIC    </li>   
  </ul>

<p align="right">(<a href="#top">back to top</a>)</p>
    
### Scripts

   In the ipfs-storage-dapp folder you'll find a directory scripts, it contain all the python code for deploying your contracts and also some useful functions

   The reset.py file is used to remove all previous contracts deployments from build directory:
   ```sh
   brownie run scripts/reset.py
   ```
   The deploy.py file allow the deployment to the blockchain, we'll use the local ganache for now:
   ```sh
   brownie run scripts/deploy.py --network=ganache-local
   ```
   The update_front_end.py is used to transfer all the smart contracts data (abi,...) and addresses to the front end in the artifacts directory:
   ```sh
   brownie run scripts/update_front_end.py
   ```
   
   After running this 3 cammands, the FileStorage contract is now deployed and is integrated with the front end
   
 <p align="right">(<a href="#top">back to top</a>)</p>
  
 ### Testing

   In your ipfs-storage-dapp folder you'll find a directory tests, it contain all the python code used for testing the smart contract functionalities
   
   You can run all the tests by :
   ```sh
   brownie test
   ```
   Or you can test each function individualy:
   ```sh
   brownie test -k <function name>
   ```
   
<p align="right">(<a href="#top">back to top</a>)</p>
   
### Front-end
   
   The user interface of this application is build using React JS, it can be started by running: 
   ```sh
   cd front-end
   yarn
   yarn start
   ```
   It uses the following libraries:
      <ul>
        <li><b>Ethers.js:</b> for conecting to Metamask and interacting with smart contract</li>
        <li><b>ipfs-http-client:</b> for connecting  and uploading files to IPFS </li>
        <li><b>@reduxjs/toolkit:</b> for managing the app states (account, balance, blockchain) </li>
        <li><b>Material UI:</b> used for react components and styles </li>    
      </ul>
      
   The files are structured as follows:
    <ul>
      <li><b>Components:</b> Contains all the app component(main, navbar, filestorage,...) </li>
      <li><b>features:</b> contains the redux toolkit reducer and actions </li>
      <li><b>artifacts:</b> contains all the smart contract data and addresses transfered earlier </li>
      <li><b>NetworksMap:</b> a json file for some known blockchains names & chain id </li> 
    </ul>
   
<p align="right">(<a href="#top">back to top</a>)</p>


<!-- Resources -->
## Resources

To learn about Smart Contract and Brownie:

  * [Patrick Collins FreeCodeCamp Complete Course](https://youtu.be/M576WGiDBdQ)
  * ["Getting Started with Brownie"](https://iamdefinitelyahuman.medium.com/getting-started-with-brownie-part-1-9b2181f4cb99) is a good tutorial to help you familiarize yourself with Brownie.

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- Contact -->
## Contact

If you have any question or problem running this project just contact me: aymenMir1001@gmail.com

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>






