// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";

contract EventFactory {
    using Counters for Counters.Counter;
    Counters.Counter private _eventID;

    // address[] public deployedEvents;

    function createEvent(string memory name, uint ticketAmount, uint ticketCost) public {
        _eventID.increment();
        uint256 currEventID = _eventID.current();
        Event newEvent = new Event(name, currEventID);
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
    constructor (string memory name, uint256 eventID) public {
        _eventName = name;
        _eventID = eventID;
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
