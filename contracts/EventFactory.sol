// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
//https://soliditydeveloper.com/ecrecover TODO: signature

import "@openzeppelin/contracts/utils/Counters.sol";

contract EventFactory {
    using Counters for Counters.Counter;
    Counters.Counter private _eventID;

    // address[] public deployedEvents;

    function createEvent(string memory name, uint ticketAmount, uint ticketCost) public {
        _eventID.increment();
        uint256 currEventID = _eventID.current();
        Event newEvent = new Event(name, _eventID, ticketAmount, ticketCost, msg.sender);
        // deployedEvents.push(newEvent);
    }

    function getDeployedEvents() public view returns(address[] memory) {
        // return deployedEvents;

    }
}

contract Event{

    string public _eventName;
    uint256 public _eventID;
    uint public _ticketAmount;
    address public _organizerAddress;
    uint public _ticketCost;
    TicketFactory public _ticketFactory;
    /*Ticket[] public _ticketList;

    struct Ticket
    {
        uint _ticketID;
        uint _eventID;
        address _manager;
        address _owner;
        uint _ticketCost;
        bool _onSale;
    }*/

    //name description capacity eventdate location price
    constructor (string memory name, uint256 eventID, uint ticketAmt, uint ticketCost, address organizer) public
    {
        _eventName = name;
        _eventID = eventID;
        _ticketAmount = ticketAmt;
        _organizerAddress = organizer;
        _ticketCost = ticketCost;
        _ticketFactory = new TicketFactory(_eventName, _eventID);
    }

    /*modifier restricted() {
        require(msg.sender == _owner, "Error: Cannot change object properties, wrong owner");
        _;
    }*/

    /*function createTicket(uint ticketCost, address manager, uint ticketID, uint eventID) private//TODO change id counter
    {
        Ticket memory newTicket = Ticket({
            _ticketID: ticketID,
            _eventID: eventID,
            _manager: manager,//owner is manager of the vent at ticket creation
            _owner: manager,
            _ticketCost: ticketCost,
            _onSale: true
        });

        //create hash and id
        _ticketList.push(newTicket);
    }*/

    /*function createTicketID(){
        return 1;
    }

    function createTicketHash(){
        return 111;
    }*/

    /*function buy_ticket(uint ticketID) public payable
    {
        Ticket foundTicket;
        for (uint i = 0; i < _ticketAmount; i++) {
            if(_ticketList[i]._ticketID == ticketID)
            {
                foundTicket = _ticketList[i];
            }
        }

        require(foundTicket._onSale == true, "Error: Ticket is not on sale.");
        require(msg.value == foundTicket._ticketCost, "Error: Ticket payment is not equal to ticket cost.");

        foundTicket._owner = msg.sender;
    }

    function setTicketSale(bool saleFlag, uint ticketID) public restricted
    {
        Ticket foundTicket;
        for (uint i = 0; i < _ticketAmount; i++) {
            if(_ticketList[i]._ticketID == ticketID)
            {
                foundTicket = _ticketList[i];
            }
        }

        //require(foundTicket.owner == msg.sender, "Error: Cannot change ticket sale state, wrong user");//same as restricted
        foundTicket.onSale = saleFlag;
    }*/

}

contract TicketFactory{
    address[] public deployedTickets;

    constructor (string memory eventName, uint eventID){
        /*
        for (uint i = 0; i < ticketAmount; i++) {
            createTicket(eventName, eventID, cost, msg.sender);
        }
        */
    }


    function createTicket(string memory eventName, uint eventID, uint cost, address creator) public {//TODO: restrict ticket creation to event managers??
        Ticket newTicket = new Ticket(eventName, eventID, cost, creator);
        // deployedTickets.push(newTicket);//TODO: map these tickets to events
    }

    function getDeployedTickets() public view returns(address[] memory) {
        return deployedTickets;
    }
}

contract Ticket{

    string public _eventName;
    uint public _id;
    uint public _eventID;
    address public _eventManager;
    address public _owner;
    uint public _cost;
    bool public _onSale;

    modifier restricted() {
        require(msg.sender == _owner, "Error: Cannot change object properties, wrong owner");
        _;
    }

    constructor (string memory eventName, uint eventID, uint cost, address creator) public restricted{
        _eventName = eventName;
        _eventID = eventID;
        _cost = cost;

        //TODO: set ticket id
        _onSale = true;
        _owner = creator;//set owner as event creator at ticket init
        _eventManager = creator;

    }

    function buy_ticket() public payable
    {
        require(_onSale == true, "Error: Ticket is not on sale.");
        require(msg.value == _cost, "Error: Ticket payment is not equal to ticket cost.");

        _owner = msg.sender;
    }

    function setTicketSale(bool saleFlag) public restricted
    {
        //require(_owner == msg.sender, "Error: Cannot change ticket sale state, wrong user");//restriced checks it
        _onSale = saleFlag;
    }
}
