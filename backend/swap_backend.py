from web3 import Web3
import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Environment Variables
RPC_URL = "https://evm-rpc.sei-apis.com"  # RPC URL of the network you're using
DRAGONSWAP_ROUTER_ADDRESS = "0xa4cF2F53D1195aDDdE9e4D3aCa54f556895712f2"  # DragonSwap V1 Router contract
SEI_ADDRESS = "0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7"  # SEI token address (WSEI for wrapped SEI)
NATIVE_SEI_ADDRESS = "0xd64a2e1ed2927499ce5a8ac9fbca3a130bfaa395"

# Initialize Web3
w3 = Web3(Web3.HTTPProvider(RPC_URL))

# Correct conversion of SEI amount to swap
SEI_AMOUNT_TO_SWAP = w3.to_wei(2, 'ether')  # Amount of SEI to swap in Wei
API_ENDPOINT = "https://sei-api.dragonswap.app/api/v1/quote"  # DragonSwap API endpoint

# Convert addresses to checksum format
DRAGONSWAP_ROUTER_ADDRESS = Web3.to_checksum_address(DRAGONSWAP_ROUTER_ADDRESS)
SEI_ADDRESS = Web3.to_checksum_address(SEI_ADDRESS)
NATIVE_SEI_ADDRESS = Web3.to_checksum_address(NATIVE_SEI_ADDRESS)

# ABI for DragonSwap V1 Router contract (with swapExactSEIForTokens function)
DragonSwapRouterABI = [
    {
        "inputs": [
            {"internalType": "uint256", "name": "amountOutMin", "type": "uint256"},
            {"internalType": "address[]", "name": "path", "type": "address[]"},
            {"internalType": "address", "name": "to", "type": "address"},
            {"internalType": "uint256", "name": "deadline", "type": "uint256"}
        ],
        "name": "swapExactSEIForTokens",
        "outputs": [{"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
            {"internalType": "uint256", "name": "amountOutMin", "type": "uint256"},
            {"internalType": "address[]", "name": "path", "type": "address[]"},
            {"internalType": "address", "name": "to", "type": "address"},
            {"internalType": "uint256", "name": "deadline", "type": "uint256"}
        ],
        "name": "swapExactTokensForSEI",
        "outputs": [{"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

ERC20_ABI = [
    {
        "constant": True,
        "inputs": [{"name": "owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [{"name": "spender", "type": "address"}, {"name": "amount", "type": "uint256"}],
        "name": "approve",
        "outputs": [{"name": "", "type": "bool"}],
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "type": "function"
    }
]

# Connect to the DragonSwap Router contract
router_contract = w3.eth.contract(address=DRAGONSWAP_ROUTER_ADDRESS, abi=DragonSwapRouterABI)

# Utility functions
def get_token_decimals(token_address):
    # Create contract instance for the token
    token_contract = w3.eth.contract(address=token_address, abi=ERC20_ABI)

    # Get the number of decimals
    decimals = token_contract.functions.decimals().call()
    return decimals

def convert_to_human_readable(raw_amount, decimals):
    # Convert the raw token amount to a human-readable format
    return raw_amount / (10 ** decimals)

def get_native_sei_balance(user_address):
    # Convert the address to checksum format
    user_address = Web3.to_checksum_address(user_address)
    
    # Get the balance in Wei (the smallest unit)
    balance_wei = w3.eth.get_balance(user_address)
    
    # Convert balance from Wei to SEI (native currency with 18 decimals)
    balance_sei = w3.from_wei(balance_wei, 'ether')
    
    return balance_sei

def fetch_quote(amount_in, memecoin_address, user_address):
    try:
        # API Call to fetch the quote for the swap
        response = requests.get(API_ENDPOINT, params={
            'amount': str(amount_in),
            'tokenInAddress': 'SEI',  # SEI token input
            'tokenOutAddress': Web3.to_checksum_address(memecoin_address),  # Target memecoin output
            'type': 'exactIn',  # We are swapping exact SEI for memecoins
            'recipient': Web3.to_checksum_address(user_address),  # User's address
            'deadline': 300,  # 5 minutes deadline
            'slippage': 0.5,  # Slippage tolerance in %
            'protocols': 'v2',  # Use v2 protocol
            'intent': 'swap'  # Swap intent
        })
        
        response_data = response.json()
        return response_data['quoteDecimals']
    except Exception as e:
        print("Error fetching quote from DragonSwap API:", e)
        return None


def buy_memecoin(private_key, memecoin_address, user_address):
    # Convert addresses to checksum format
    memecoin_address = Web3.to_checksum_address(memecoin_address)
    user_address = Web3.to_checksum_address(user_address)

    # Prepare parameters for swapExactSEIForTokens
    amount_out_min = 0  # Minimum amount of memecoins
    path = [SEI_ADDRESS, memecoin_address]  # Path for swapping SEI -> memecoin
    to = user_address  # Recipient address
    deadline = int(w3.eth.get_block('latest')['timestamp']) + 300  # Current time + 5 minutes

    # Build transaction
    txn = router_contract.functions.swapExactSEIForTokens(
        amount_out_min,
        path,
        to,
        deadline
    ).build_transaction({
        'chainId': 1329,  # Replace with the appropriate chain ID
        'gas': 700000,  # Set a gas limit
        'gasPrice': w3.eth.gas_price,
        'nonce': w3.eth.get_transaction_count(user_address),
        'value': SEI_AMOUNT_TO_SWAP  # SEI as msg.value
    })

    # Sign and send the transaction
    signed_txn = w3.eth.account.sign_transaction(txn, private_key=private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    print('Transaction submitted, waiting for confirmation...')
    
    # Wait for the transaction receipt
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print('Swap successful!', receipt)

    memecoin_contract = w3.eth.contract(address=memecoin_address, abi=ERC20_ABI)
    balance_after = memecoin_contract.functions.balanceOf(user_address).call()
    return balance_after
 
def sell_memecoin(private_key, memecoin_address, user_address):
    # Convert addresses to checksum format
    memecoin_address = Web3.to_checksum_address(memecoin_address)
    user_address = Web3.to_checksum_address(user_address)

    # Initialize memecoin contract instance
    memecoin_contract = w3.eth.contract(address=memecoin_address, abi=ERC20_ABI)

    # Get the user's current balance of the memecoin
    memecoin_balance = memecoin_contract.functions.balanceOf(user_address).call()

    if memecoin_balance == 0:
        print("User has no memecoins to sell.")
        return None

    # Approve the router contract to spend the user's memecoins
    approve_txn = memecoin_contract.functions.approve(
        DRAGONSWAP_ROUTER_ADDRESS, memecoin_balance
    ).build_transaction({
        'chainId': 1329,
        'gas': 500000,  # Set gas limit for approval transaction
        'gasPrice': w3.eth.gas_price,
        'nonce': w3.eth.get_transaction_count(user_address)
    })

    # Sign and send the approval transaction
    signed_approve_txn = w3.eth.account.sign_transaction(approve_txn, private_key=private_key)
    approve_tx_hash = w3.eth.send_raw_transaction(signed_approve_txn.raw_transaction)
    print('Approval transaction submitted, waiting for confirmation...')
    w3.eth.wait_for_transaction_receipt(approve_tx_hash)
    print('Approval successful!')

    # Prepare parameters for swapExactTokensForSEI
    amount_in = memecoin_balance  # Amount of memecoins to sell
    amount_out_min = 0  # Minimum amount of SEI (set to 0 for simplicity, adjust for production)
    path = [memecoin_address, SEI_ADDRESS]  # Path for swapping memecoin -> SEI
    to = user_address  # Recipient address
    deadline = int(w3.eth.get_block('latest')['timestamp']) + 300  # Current time + 5 minutes

    # Build the swap transaction
    txn = router_contract.functions.swapExactTokensForSEI(
        amount_in,
        amount_out_min,
        path,
        to,
        deadline
    ).build_transaction({
        'chainId': 1329,  # Replace with the appropriate chain ID
        'gas': 700000,  # Set a gas limit
        'gasPrice': w3.eth.gas_price,
        'nonce': w3.eth.get_transaction_count(user_address)
    })

    # Sign and send the transaction
    signed_txn = w3.eth.account.sign_transaction(txn, private_key=private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    print('Transaction submitted, waiting for confirmation...')
    
    # Wait for the transaction receipt
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print('Swap successful!', receipt)

    sei_balance_after = get_native_sei_balance(user_address)
    print(f'SEI balance after swap: {sei_balance_after}')
    
    # Return the transaction receipt
    return sei_balance_after
    
# Example usage
PRIVATE_KEY = "580c60020c6b03387741374416bd157517401523aaa7f2861013664f6b80355f"
MEMECOIN_ADDRESS = "0x5f0e07dfee5832faa00c63f2d33a0d79150e8598"
USER_ADDRESS = "0xd64a2e1eD2927499ce5A8ac9FbCa3A130BFAa395"
print(get_native_sei_balance(USER_ADDRESS))


# print(fetch_quote(SEI_AMOUNT_TO_SWAP, MEMECOIN_ADDRESS, USER_ADDRESS))
