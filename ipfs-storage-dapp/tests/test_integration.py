from brownie import FileStorage, network
from scripts.helper_scripts import get_account, get_contract, toWei, LOCAL_BLOCKCHAINS, ZERO_ADDRESS
import pytest

# Input given by the user
FILE_NAME = "my_test_file"
FILE_SIZE = 60000
FILE_URI = "https://ipfs/my_test_file"

# deploy to polygon-test network
def test_deployement_to_real_network():
    if network.show_active() in LOCAL_BLOCKCHAINS:
        pytest.skip()
    account = get_account()

    price_feed = get_contract("matic_price_feed")

    storage = FileStorage.deploy(price_feed.address, {"from": account})

    # fee = 0.001$
    fee = toWei(0.001)

    set_tx = storage.setListingFee(fee, {"from": account})
    set_tx.wait(1)


    assert storage.address != ZERO_ADDRESS
    assert storage.owner() == account 
    

    
