// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CustomToken is ERC20, Ownable {
    constructor() ERC20("FEUToken", "FIT") Ownable(msg.sender) {
        uint initialSupply = 100; 
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint amount) public {
        _burn(msg.sender, amount);
    }

    function tokenTransfer(address destination, uint amount) public {
        require(destination != address(0), "Invalid address");
        require(amount > 0, "Cannot transfer a value below zero");
        
        _transfer(_msgSender(), destination, amount);
    }
}