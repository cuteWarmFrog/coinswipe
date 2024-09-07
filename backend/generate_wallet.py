from web3 import Web3
from eth_account import Account
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Generate a new wallet
def generate_wallet():
    account = Account.create()  # Generate a new private key and address
    private_key = account.key.hex()
    address = account.address
    return private_key, address