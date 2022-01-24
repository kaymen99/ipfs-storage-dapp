from brownie import config, network, accounts, MockV3Aggregator, Contract
from web3 import Web3


LOCAL_BLOCKCHAINS = ["ganache-local", "development"]

FORKED_BLOCHCHAINS = ["polygone-mainnet-dev"]

contract2mock = {"matic_price_feed": MockV3Aggregator}

ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

def get_account(index=None):
    if network.show_active() in LOCAL_BLOCKCHAINS or network.show_active() in FORKED_BLOCHCHAINS:
        if index is not None:
            return accounts[index]
        else:
            return accounts[0]
    else:
        return accounts.add(config["wallets"]["from_key"])

def toWei(amount):
    return Web3.toWei(amount, "ether")

def fromWei(amount):
    return Web3.fromWei(amount, "ether")

def deploy_mock():

    DECIMALS = 8
    INIT_VAL = 2.24 * 10**8
    
    account = get_account()

    print("deploying MockV3Aggregator")
    MockV3Aggregator.deploy(DECIMALS, INIT_VAL, {"from":account})

def get_contract(name):

    _contract = contract2mock[name]
    if network.show_active() in LOCAL_BLOCKCHAINS:
        if len(_contract) <= 0:
            print(f"Deploying mock")
            deploy_mock()
        contract =  _contract[-1]
        
    else:
        contract_address = config["networks"][network.show_active()][name]
        contract = Contract.from_abi(_contract._name, contract_address, _contract.abi)
    
    return contract