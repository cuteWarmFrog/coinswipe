from web3 import Web3
import time

# Set up Web3 connection
RPC_URL = "https://sepolia.infura.io/v3/e4da97937e1d4481ac3cf7b418159d3a"  # Replace with your Infura project ID
w3 = Web3(Web3.HTTPProvider(RPC_URL))

# Contract details
CONTRACT_ADDRESS = "0x8eEe209E95d8ADa04f2A798c49B860Ebd699EeDD"  # ORA's Prompt contract address
ABI = [  # Contract ABI
    {
        "inputs": [{"internalType": "uint256", "name": "modelId", "type": "uint256"}],
        "name": "estimateFee",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "modelId", "type": "uint256"},
            {"internalType": "string", "name": "prompt", "type": "string"}
        ],
        "name": "calculateAIResult",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "modelId", "type": "uint256"},
            {"internalType": "string", "name": "prompt", "type": "string"}
        ],
        "name": "getAIResult",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    }
]


# User variables
PRIVATE_KEY = "INSERT PRIVATE KEY HERE"
USER_ADDRESS = "0xd64a2e1eD2927499ce5A8ac9FbCa3A130BFAa395"

# Connect to the contract
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)

def estimate_fee(model_id):
    """Estimate the fee required for the AI inference."""
    print("Estimating fee...")
    fee = contract.functions.estimateFee(model_id).call()
    return fee

def calculate_ai_result(fee, prompt, model_id):
    """Send a transaction to calculate the AI result."""
    nonce = w3.eth.get_transaction_count(USER_ADDRESS)
    txn = contract.functions.calculateAIResult(
        model_id,
        prompt
    ).build_transaction({
        'from': USER_ADDRESS,
        'value': fee,  # Send fee in Wei
        'gas': 500000,  # Lower gas limit
        'gasPrice': w3.to_wei('5', 'gwei'),  # Lower gas price
        'nonce': nonce,
    })

    # Sign the transaction
    signed_txn = w3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)

    # Send the transaction
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    print(f"Transaction sent with hash: {tx_hash.hex()}")

    # Wait for the transaction receipt
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print("Transaction confirmed:", receipt)

def get_ai_result(model_id, prompt):
    """Retrieve the AI result for the given prompt and model ID."""
    result = contract.functions.getAIResult(model_id, prompt).call()
    return result

def use_llama3(prompt):
    """Main function to interact with Llama3 (Model ID 11) on the contract."""
    model_id = 11  # Model ID for Llama3

    # Step 1: Estimate Fee
    fee = estimate_fee(model_id)
    print(f"Estimated fee for Llama3: {w3.from_wei(fee, 'ether')} ETH")

    # Step 2: Send Transaction to Calculate AI Result
    calculate_ai_result(fee, prompt, model_id)

    # Step 3: Wait and Retrieve AI Result
    print("Waiting for AI result to be available...")
    time.sleep(30)  # Wait for 10 seconds or adjust as necessary
    result = get_ai_result(model_id, prompt)
    print(f"AI Inference Result: {result}")

# Example usage
# prompt_text = "Where is AI heading?"
# use_llama3(prompt_text)
