const init = async () => {
    const connectWalletBtn = document.getElementById("connectWalletBtn");
    const networkStatus = document.getElementById("networkStatus");
    const loadingOverlay = document.getElementById("loadingOverlay");
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const taskCounter = document.getElementById("taskCounter");
    let web3, contract, accounts;

    // Contract address (replace with your deployed contract address)
    const contractAddress = "0x4eD4C59eb738696F43F5e25E4289369f594f4A10"; // From truffle migrate output

    // Fetch ABI
    let contractABI;
    try {
        const response = await fetch("./TodoList.json");
        if (!response.ok) throw new Error("Failed to fetch TodoList.json");
        const contractJson = await response.json();
        contractABI = contractJson.abi;
    } catch (error) {
        console.error("ABI Fetch Error:", error);
        networkStatus.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>Error loading contract ABI`;
        networkStatus.classList.remove("hidden");
        return;
    }

    // Check for MetaMask
    if (!window.ethereum) {
        networkStatus.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i>Please install MetaMask';
        networkStatus.classList.remove("hidden");
        return;
    }

    // Initialize Web3
    web3 = new Web3(window.ethereum);

    // Connect wallet function
    const connectWallet = async () => {
        try {
            // Request accounts
            accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            connectWalletBtn.innerHTML = `<i class="fas fa-wallet mr-2"></i>${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
            connectWalletBtn.classList.add("bg-green-500", "hover:bg-green-600");
            connectWalletBtn.classList.remove("bg-blue-500", "hover:bg-blue-600");

            // Check network (Ganache: chainId 1337)
            const chainId = await web3.eth.getChainId();
            if (chainId !== 1337) {
                networkStatus.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i>Please switch to Localhost 7545';
                networkStatus.classList.remove("hidden");
                return;
            }
            networkStatus.classList.add("hidden");

            // Initialize contract
            contract = new web3.eth.Contract(contractABI, contractAddress);

            // Load tasks
            await loadTasks();
            addTaskBtn.disabled = false;
        } catch (error) {
            console.error("Connect Wallet Error:", error);
            networkStatus.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>Error: ${error.message}`;
            networkStatus.classList.remove("hidden");
        }
    };

    // Load tasks
    const loadTasks = async () => {
        if (!contract) return;
        try {
            taskList.innerHTML = "";
            const taskCount = await contract.methods.taskCount().call();
            taskCounter.innerText = `${taskCount} task${taskCount === 1 ? "" : "s"}`;
            if (taskCount == 0) {
                taskList.innerHTML = '<li class="p-4 text-center text-gray-500" id="emptyState">No tasks yet. Add your first task above!</li>';
                return;
            }
            for (let i = 1; i <= taskCount; i++) {
                const task = await contract.methods.getTask(i).call();
                const li = document.createElement("li");
                li.className = "p-4 flex items-center";
                li.innerHTML = `<i class="fas fa-circle mr-3 text-blue-500"></i>${task[1]}`;
                taskList.appendChild(li);
            }
        } catch (error) {
            console.error("Load Tasks Error:", error);
            networkStatus.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>Error loading tasks`;
            networkStatus.classList.remove("hidden");
        }
    };

    // Add task
    addTaskBtn.onclick = async () => {
        if (!contract || !accounts) {
            networkStatus.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i>Please connect wallet';
            networkStatus.classList.remove("hidden");
            return;
        }
        const content = taskInput.value.trim();
        if (!content) {
            networkStatus.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i>Task cannot be empty';
            networkStatus.classList.remove("hidden");
            return;
        }
        try {
            loadingOverlay.classList.remove("hidden");
            await contract.methods.createTask(content).send({ from: accounts[0] });
            taskInput.value = "";
            await loadTasks();
        } catch (error) {
            console.error("Add Task Error:", error);
            networkStatus.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>Error: ${error.message}`;
            networkStatus.classList.remove("hidden");
        } finally {
            loadingOverlay.classList.add("hidden");
        }
    };

    // Connect wallet button
    connectWalletBtn.onclick = connectWallet;

    // Listen for TaskCreated event
    if (contract) {
        contract.events.TaskCreated({}, (error) => {
            if (!error) loadTasks();
            else console.error("Event Error:", error);
        });
    }

    // Listen for account/network changes
    window.ethereum.on("accountsChanged", () => {
        connectWalletBtn.innerHTML = '<i class="fas fa-wallet mr-2"></i>Connect Wallet';
        connectWalletBtn.classList.remove("bg-green-500", "hover:bg-green-600");
        connectWalletBtn.classList.add("bg-blue-500", "hover:bg-blue-600");
        addTaskBtn.disabled = true;
        taskList.innerHTML = '<li class="p-4 text-center text-gray-500" id="emptyState">No tasks yet. Add your first task above!</li>';
        networkStatus.classList.add("hidden");
    });

    window.ethereum.on("chainChanged", () => {
        window.location.reload();
    });
};

window.addEventListener("load", init);