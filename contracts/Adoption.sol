// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

// contract Adopt {
  
//   struct Pet {
//       uint id;
//       bool adopted;
//   }

//   mapping(uint => Pet) public Pets;


//   event AdoptCompleted(
//     uint id,
//     bool completed
//   );

//   function StatusChange (uint _petId) public {
//         Pets[_petId] = Pet(_petId, true);
//         emit AdoptCompleted(_petId, true);
//   }
// }

contract Adoption {
    address[16] public adopters;

    // Adopting a pet
    function adopt(uint petId) public returns (uint) {
      require(petId >= 0 && petId <= 15);

      adopters[petId] = msg.sender;

      return petId;
    }

    // Retrieving the adopters
    function getAdopters() public view returns (address[16] memory) {
      return adopters;
    }

    



}
