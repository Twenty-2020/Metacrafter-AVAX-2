// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MusicStore {
    // Public variables
    mapping(address => bool) public subscribers;
    uint public albumPrice = 0.005 ether; 
    uint public albumStock = 50;
    uint public albumSold;
    mapping(address => uint256) public purchases;

    modifier subscriberOnly() {
        require(subscribers[msg.sender], "You must be a subscriber to perform this action.");
        _;
    }

    function subscribe() public payable {
        require(msg.value == 0.001 ether, "Pay 0.001 ETH to become a subscriber"); 
        require(!subscribers[msg.sender], "Already subscribed");
        subscribers[msg.sender] = true;
    }

    function purchase() public payable subscriberOnly {
        require(msg.value == albumPrice, "Incorrect amount paid for the album");
        require(albumSold < albumStock, "Album out of stock");

        if (purchases[msg.sender] >= 2) {
            revert("You have reached the maximum purchase limit of 2 albums.");
        }

        purchases[msg.sender]++;
        albumSold++;
        albumStock--; 

        assert(albumSold <= 50); 
    }

    function refund() public subscriberOnly {
        require(purchases[msg.sender] > 0, "You haven't purchased any albums to refund");

        purchases[msg.sender]--;
        albumSold--;
        albumStock++; 

        (bool success, ) = msg.sender.call{value: albumPrice}("");
        require(success, "Refund failed");

        assert(albumSold >= 0);
    }

    receive() external payable {}
}