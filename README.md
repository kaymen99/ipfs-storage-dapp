<div id="top"></div>

<!-- ABOUT THE PROJECT -->
## IPFS storage Dapp


![Capture d’écran 2022-01-23 à 13 28 21](https://user-images.githubusercontent.com/83681204/150874956-c01456cf-0390-42b8-b72c-37bf5471aa17.png)


This a decentralized application built on the Ethereum/Polygon blockchain, it works like Dropbox by allowing users to securely store their files on the blockchain using IPFS Technology

### Built With

* [solidity](https://docs.soliditylang.org/)
* [Brownie](https://eth-brownie.readthedocs.io)
* [React.js](https://reactjs.org/)
* [ethers.js](https://docs.ethers.io/v5/)


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
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>


<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

Please install or have installed the following:
* [nodejs and npm](https://nodejs.org/en/download/) 
* [python](https://www.python.org/downloads/)

### Installation

1. Install Brownie, Brownie is a python framework for smart contracts development,testing and deployments. It's quit like [HardHat](https://hardhat.org) but it uses python for writing test and deployements scripts instead of javascript
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
   
3. Clone the repo:
   ```sh
   git clone https://github.com/Aymen1001/ipfs-storage-dapp.git
   cd ipfs-storage-dapp
   ```
3. Install Ganache:
   Ganache is a local blockchain that run on your machine, it's used during development stages because it allows quick smart contract testing and avoids all real         Testnets problems. You can install ganache from this link : https://trufflesuite.com/ganache/
   
   Next, you need to setup the network with brownie :
   ```sh
   cd ipfs-storage-dapp
   brownie networks add development ganache-local cmd=ganache-cli host=http://127.0.0.1 accounts=10 mnemonic=brownie port=8545
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

<h3>Contracts</h3>
    In your ipfs-storage-dapp folder you'll find a directory contracts, all the smart contracts build in brownie are stored there. The FileStorage contract is the core of this application, it plays the role of the backend and has the following features:
    <br/>
    <div>
      <ul>
        <li><b>SetUploadFee:</b> for every file uploaded the user must pay a small fee set by the owner of the contract</li>
        <li><b>Upload:</b> allows the user to upload his file </li>
        <li><b>getUserFiles:</b> a function for getting all the files uploaded by a given user </li>
        <li><b>Chainlink Price Feed:</b> the contract uses the price feed provided by chainlink oracle for converting the fee set by the owner from $ to MATIC    </li>   
      </ul>
   </div>
    
<h3>Scripts</h3>

   In your ipfs-storage-dapp folder you'll find a directory scripts, it contain all the python code for deploying your contracts and also some useful functions

   The reset.py file is used to remove all previous contracts deployments from build directory:
   ```sh
   brownie run scripts/reset.py
   ```
   The deploy.py file allow the deployment to the blockchain, we'll use the local ganache for now:
   ```sh
   brownie run scripts/deploy.py --network ganache-local
   ```
   The update_front_end.py is used to transfer all the smart contracts data (abi,...) and addresses to front end:
   ```sh
   brownie run scripts/update_front_end.py
   ```
   
   After running this 3 cammands, the FileStorage contract is now deployed and is integrated with the front end
  
 <h3>Testing</h3>

   In your ipfs-storage-dapp folder you'll find a directory tests, it contain all the python code used for testing the smart contract functionalities
   
   You can run all the tests by :
   ```sh
   brownie test
   ```
   Or you can test each function individualy:
   ```sh
   brownie test -k <function name>
   ```
   
 <h3>Front end</h3>
   
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

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
    - [ ] Nested Feature

See the [open issues](https://github.com/github_username/repo_name/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email@email_client.com

Project Link: [https://github.com/github_username/repo_name](https://github.com/github_username/repo_name)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png




