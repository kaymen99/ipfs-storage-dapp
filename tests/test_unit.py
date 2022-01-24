from brownie import FileStorage, network, exceptions
from scripts.helper_scripts import get_account, get_contract, toWei, LOCAL_BLOCKCHAINS
import pytest, brownie, time


# Input given by the user
FILE_NAME = "my_test_file"
FILE_SIZE = 60000
FILE_URI = "https://ipfs/my_test_file"


# fee = 0.001$ 
FEE = toWei(0.001)

# test set fee and correct conversion from $ to MATIC
def test_set_and_convert_fee():
    # test only on local chains
    if network.show_active() not in LOCAL_BLOCKCHAINS:
        pytest.skip()

    account = get_account()

    # Matic price feed contract from chainlink
    price_feed = get_contract("matic_price_feed")

    storage = FileStorage.deploy(price_feed.address, {"from": account})

    set_tx = storage.setListingFee(FEE, {"from": account})
    set_tx.wait(1)

    listingFee = storage.getListingFee()

    # we take 1 MATIC = 2.24$
    converted_fee = FEE / 2.24

    assert listingFee == converted_fee

# test upload and get user files functions 
def test_upload_and_get_file():

    # test only on local chains
    if network.show_active() not in LOCAL_BLOCKCHAINS:
        pytest.skip()

    account = get_account()
    initial_account_balance = account.balance()
 
    # Matic price feed contract from chainlink
    price_feed = get_contract("matic_price_feed")

    storage = FileStorage.deploy(price_feed.address, {"from": account})

    set_tx = storage.setListingFee(FEE, {"from": account})
    set_tx.wait(1)

    user = get_account(1)
    listingFee = storage.getListingFee()

    upload_tx = storage.uploadFile(FILE_NAME, FILE_SIZE, FILE_URI, {"from": user, "value": listingFee})
    upload_tx.wait(1)

    # uploaded transaction event 

    event = upload_tx.events["FileAdded"]

    user_files = storage.getUserFiles(user, {"from": user})

    assert account.balance() == listingFee + initial_account_balance
    assert user_files[0] == (FILE_NAME, FILE_SIZE, FILE_URI, time.time())
    assert len(user_files)  == 1
    assert event["user"] == user
    assert event["fileName"] == FILE_NAME

# test onlyOwner modifier 
def test_only_owner():
    # test only on local chains
    if network.show_active() not in LOCAL_BLOCKCHAINS:
        pytest.skip()

    account = get_account()
 
    # Matic price feed contract from chainlink
    price_feed = get_contract("matic_price_feed")

    storage = FileStorage.deploy(price_feed.address, {"from": account})

    user = get_account(1)

    # ONLY OWNER CAN SET THE FEE 
    # skip the exepected error that revert for non owner 
    with brownie.reverts("only owner can use this"):
        set_tx = storage.setListingFee(FEE, {"from": user})
        set_tx.wait(1)

# test that only user can access his files
def test_user_files_access():

    # test only on local chains
    if network.show_active() not in LOCAL_BLOCKCHAINS:
        pytest.skip()

    account = get_account()
 
    # Matic price feed contract from chainlink
    price_feed = get_contract("matic_price_feed")

    storage = FileStorage.deploy(price_feed.address, {"from": account})

    set_tx = storage.setListingFee(FEE, {"from": account})
    set_tx.wait(1)

    user = get_account(1)
    listingFee = storage.getListingFee()

    upload_tx = storage.uploadFile(FILE_NAME, FILE_SIZE, FILE_URI, {"from": user, "value": listingFee})
    upload_tx.wait(1)

    random_user = get_account(5)

    with brownie.reverts("only user can check his own files"):
        user_files = storage.getUserFiles(user, {"from": random_user})

    user_files = storage.getUserFiles(user, {"from": user})

    assert user_files[0][0: 3] == (FILE_NAME, FILE_SIZE, FILE_URI)


