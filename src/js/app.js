App = {
  web3Provider: null,
  contracts: {},
  
  //I tried to add my first comment here


  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // if (typeof web3 !== 'undefined') {
    //   App.web3Provider = web3.currentProvider
    //   web3 = new Web3(web3.currentProvider)
    // } else {
    //   window.alert("Please connect to Metamask.")
    // }
    // // Modern dapp browsers...
    // if (window.ethereum) {
    //   window.web3 = new Web3(ethereum)
    //   try {
    //     // Request account access if needed
    //     await ethereum.enable()
    //     // Acccounts now exposed
    //     web3.eth.sendTransaction({/* ... */})
    //   } catch (error) {
    //     // User denied account access...
    //   }
    // }
    // // Legacy dapp browsers...
    // else if (window.web3) {
    //   App.web3Provider = web3.currentProvider
    //   window.web3 = new Web3(web3.currentProvider)
    //   // Acccounts always exposed
    //   web3.eth.sendTransaction({/* ... */})
    // }
    // // Non-dapp browsers...
    // else {
    //   console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    // }
    // // Set the current blockchain account
    // web3.eth.defaultAccount=web3.eth.accounts[0];
    
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);



    return App.initContract();
  },

  initContract: async function() {
    // // Create a JavaScript version of the smart contract
    // const adopt = await $.getJSON('Adopt.json')
    // App.contracts.Adopt = TruffleContract(adopt)
    // App.contracts.Adopt.setProvider(App.web3Provider)

    // // Hydrate the smart contract with values from the blockchain
    // App.Adopt = await App.contracts.Adopt.deployed()

    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
    
      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });
    
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function() {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
    
      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdopt: async function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
    
    // console.log(petId);

    // App.Adopt.StatusChange(petId);

    // //should get the first account on ganache
    // web3.eth.getAccounts().then(function(result){ 
    //   accounts = result 
    // });
    
    // console.log(accounts[0]);


    // const receipt = await App.Adopt.AdoptCompleted('hey').send({
    //     //from: addresses[0]
    // });

    //console.log(receipt.events);

    // App.Adopt.events.AdoptCompleted({})
    // .on('data', async function(event){
    //     console.log(event.returnValues);
    //     // Do something here
    // })
    // .on('error', console.error);
    /*
     * Replace me...
     */

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });



  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
