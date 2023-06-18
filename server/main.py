from typing import List
from fastapi import FastAPI
from web3 import Web3
from web3.middleware import geth_poa_middleware

# Initialize FastAPI
app = FastAPI()

# Infura API configuration
infura_url = "https://sepolia.infura.io/v3/try"
web3 = Web3(Web3.HTTPProvider(infura_url))
web3.middleware_onion.inject(geth_poa_middleware, layer=0)

# Contract configuration
contract_address = "0xEeb29569f046C2D7F82b2Dd1fB23D8B2F7dd4209"
contract_abi = [
    
]

contract = web3.eth.contract(address=contract_address, abi=contract_abi)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/courses")
def get_courses():
    total_courses = contract.functions.totalCourses().call()
    courses = []
    for i in range(1, total_courses + 1):
        course = contract.functions.courses(i).call()
        courses.append(course)
    return courses

@app.get("/students/{address}")
def get_student_details(address: str):
    student = contract.functions.students(web3.toChecksumAddress(address)).call()
    return {
        "rollNumber": student[0],
        "name": student[1],
        "cgpa": student[2],
        "wallet": student[3]
    }

@app.post("/students")
def add_student(roll_number: int, name: str, wallet: str):
    transaction = contract.functions.addWalletForStudent(
        web3.toChecksumAddress(wallet),
        roll_number,
        name
    ).buildTransaction({
        "from": web3.eth.defaultAccount,
        "nonce": web3.eth.getTransactionCount(web3.eth.defaultAccount)
    })
    signed_txn = web3.eth.account.signTransaction(transaction, private_key="YOUR_PRIVATE_KEY")
    tx_hash = web3.eth.sendRawTransaction(signed_txn.rawTransaction)
    return {"message": "Student added successfully", "transactionHash": web3.toHex(tx_hash)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
