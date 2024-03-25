document.addEventListener("DOMContentLoaded", function () {
  const enableMetaMaskButton = document.querySelector('.enableMetamask');
  const statusText = document.querySelector('.statusText');
  const listenToEventsButton = document.querySelector('.startStopEventListener');
  const contractAddr = document.querySelector('#address');
  const eventResult = document.querySelector('.eventResult');

  enableMetaMaskButton.addEventListener('click', () => {
    enableDapp();
  });
  listenToEventsButton.addEventListener('click', () => {
    listenToEvents();
  });

  let accounts;
  let web3;

  async function enableDapp() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        accounts = await ethereum.request({
          method: 'eth_requestAccounts'
        });
        web3 = new Web3(window.ethereum);
        statusText.innerHTML = "Account: " + accounts[0];

        listenToEventsButton.removeAttribute("disabled");
        contractAddr.removeAttribute("disabled");
      } catch (error) {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          statusText.innerHTML = "Error: Need permission to access MetaMask";
          console.log('Permissions needed to continue.');
        } else {
          console.error(error.message);
        }
      }
    } else {
      statusText.innerHTML = "Error: Need to install MetaMask";
    }
  }

  function listenToEvents() {
    const contractAddress = '0xfF407Ddf65Db14d7266aB94cf0427007955e9fcA'
    const abi = [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "_from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "_to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "TokensSent",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "sendToken",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "tokenBalance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]

    const contractAddrInput = document.getElementById('address');
    const contractAddrValue = contractAddrInput.value;

    let contractInstance = new web3.eth.Contract(abi, contractAddrValue);

    // Listening to the events that are happening in the contract. Note: Events are specified in contract to be able to listen to the event we need to specify it in the contract.
    contractInstance.events.TokensSent().on("data", (event) => {
      eventResult.innerHTML = JSON.stringify(event) + "<br/> ------------<br/>" + eventResult.innerHTML;
    });


    // Getting all the events that happened in the contract
    contractInstance.getPastEvents('TokensSent', {
      // filter: {_to: "0xb4b6a91784f6d9f90b6120eaed28707ab5b35112"},
      fromBlock: 0
    }).then((event) => {
      eventResult.innerHTML = JSON.stringify(event) + "<br/> ------------<br/>" + eventResult.innerHTML;
    })
  }
});
