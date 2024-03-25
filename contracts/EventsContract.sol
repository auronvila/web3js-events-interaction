// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract SampleEvent {
    // to deploy the contract you can use remix and fill the necessary information when you open the index.html
    mapping (address => uint) public tokenBalance;

    constructor() {
        tokenBalance[msg.sender] = 100;
    }

    event TokensSent(address indexed _from, address indexed _to, uint _amount);

    function sendToken(address _to, uint _amount) public returns(bool) {
        require(tokenBalance[msg.sender] > _amount, "Not enough tokens");
        tokenBalance[msg.sender] -= _amount;
        tokenBalance[_to] += _amount;
        emit TokensSent(msg.sender, _to, _amount);
        return true;
    }
}