from brownie import FileStorage
from web3 import Web3
from scripts.helper_scripts import get_account, get_contract, toWei


def deploy():
    account = get_account()

    price_feed = get_contract("matic_price_feed")

    storage = FileStorage.deploy(price_feed.address, {"from": account})

    # fee = 0.001$
    fee = toWei(0.001)

    set_tx = storage.setListingFee(fee, {"from": account})
    set_tx.wait(1)

    listingFee = storage.getListingFee()
    listingFee = Web3.fromWei(listingFee, "ether")

    print("storage deployed at: ", storage.address)
    print(f"listing fee is: {listingFee} MATIC")

def main():
    deploy()