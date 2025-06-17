To-do List DApp
Overview
This project is a decentralized To-do List application (DApp). It uses Ethereum smart contracts to manage tasks on the blockchain, with a frontend for user interaction. The smart contract is written in Solidity, deployed using Truffle and Ganache, and the frontend is built with HTML, JavaScript, Web3.js, Tailwind CSS, and Font Awesome. Users can connect their MetaMask wallet, add tasks, and view them, with all data stored on the blockchain.
Features

Create tasks via a Solidity smart contract.
View tasks stored on the blockchain.
Connect to MetaMask for transaction signing.
Responsive UI with Tailwind CSS and Font Awesome icons.
Local blockchain testing with Ganache.
Automated tests for the smart contract.

Prerequisites

Node.js: Version 16 or later.
Truffle: npm install -g truffle.
Ganache: GUI or CLI (npm install -g ganache-cli).
MetaMask: Browser extension for wallet integration.
VS Code: Recommended for editing and formatting (use 4-space indentation).
Browser: Chrome or Firefox for MetaMask compatibility.


Setup Instructions

Clone the Repository (if applicable, or create the project structure):
git clone https://github.com/Rukundo-Bahati/To-Do-List_Dapp.git
cd To-Do-List-Dapp


Install Dependencies:
npm install

Start Ganache:

GUI: Launch Ganache, create a new workspace, and note the port (127.0.0.1:7545, chainId: 1337).
CLI:ganache-cli


Configure Truffle:

Ensure truffle-config.js is set for Ganache:networks: {
  development: {
    host: "127.0.0.1",
    port: 7545,
    network_id: "*"
  }
}




Compile and Deploy the Contract:
truffle compile
truffle migrate --network development


Copy the deployed contract address from the terminal (e.g., 0x...).
Copy build/contracts/TodoList.json to client/:cp build/contracts/TodoList.json client/




Update Frontend:

Open client/app.js and replace YOUR_CONTRACT_ADDRESS with the deployed contract address.


Run the Frontend:
npm run dev


Opens http://localhost:3000 (or the port shown by lite-server).


Connect MetaMask:

In MetaMask, add the Ganache network:
Network Name: Localhost 7545
RPC URL: http://127.0.0.1:7545
Chain ID: 1337


Import a Ganache account:
Copy a private key from Ganache (GUI or CLI).
In MetaMask, go to “Import Account” and paste the private key.





Usage

Open http://localhost:3000 in a browser with MetaMask.
Click “Connect Wallet” to connect MetaMask (ensure Localhost 7545 is selected).
Enter a task in the input field and click “Add” to create a task on the blockchain.
View tasks in the list, updated in real-time via contract events.
Check the browser console (F12 > Console) for errors if issues arise.

Testing
Run smart contract tests to verify functionality:
truffle test

Tests include:

Creating a task and verifying its content.
Ensuring the task count increments correctly.

Troubleshooting

Wallet Connection Fails:
Ensure MetaMask is installed, unlocked, and set to Localhost 7545.
Check client/app.js for the correct contract address.


Tasks Don’t Load:
Verify client/TodoList.json exists and is accessible via http://localhost:3000/TodoList.json.
Ensure Ganache is running and the contract is deployed.


Indentation Errors:
Use 4-space indentation in all files. Run prettier --write . (if Prettier is installed) or use VS Code’s auto-format (Shift+Alt+F).


Transaction Errors:
Ensure the MetaMask account has ETH (Ganache provides 100 ETH per account).
Check Gas Limit in MetaMask (default settings usually work).



Notes

The contract includes a sample task created on deployment (ID 1). New tasks start from ID 2.
The “Clear Completed” button is not implemented, as the contract lacks a task completion feature. To add this, extend TodoList.sol with a toggleCompleted function.
For homework submission, create a zip excluding node_modules/ and build/:zip -r todo-list-dapp.zip . -x "node_modules/*" "build/*"



Dependencies

Truffle: Smart contract development and deployment.
Ganache: Local Ethereum blockchain.
Web3.js: Blockchain interaction (v1.7.0).
Tailwind CSS: Styling (CDN).
Font Awesome: Icons (v6.4.0).
lite-server: Local development server.

Future Improvements

Add task completion functionality with a toggleCompleted function.
Implement “Clear Completed” to delete completed tasks.
Add error handling for transaction timeouts.
Use a bundler (e.g., Parcel) for module imports.

