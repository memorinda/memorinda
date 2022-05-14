// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";

contract EventFactory {
    using Counters for Counters.Counter;
    Counters.Counter private _eventID;//keep track of event ids

    address[] public deployedEvents;

    function createEvent(string memory name) public {
        _eventID.increment();
        uint256 currEventID = _eventID.current();
        Event newEvent = new Event(name, currEventID, msg.sender);
        
        deployedEvents.push(address(newEvent));
    }

    function getDeployedEvents() public view returns(address[] memory) {
        return deployedEvents;
    }

}

contract Event{

    string public _eventName;
    uint256 public _eventID;
    address public _organizerAddress;

    Ticket[] public _ticketList;

    struct Ticket 
    {
        uint _ticketID;
        uint _eventID;
        address _manager;
        address _owner;
        uint _ticketCost;
        bool _onSale;
    }
    //name description capacity eventdate location price
    constructor (string memory name, uint256 eventID, address creator) public {
        _eventName = name;
        _eventID = eventID;
        _organizerAddress = creator;
    }

    function createTicketsByAmount(uint ticketCost, uint ticketAmount) public {
        for (uint i = 0; i < ticketAmount; i++) 
        {
            createTicket(ticketCost, i);
        }
    }

    //create a single ticket
    function createTicket(uint ticketCost, uint ticketID) private {

        Ticket memory newTicket = Ticket({
            _ticketID: ticketID,//TODO: add ticket ID
            _eventID: _eventID,
            _manager: _organizerAddress,//owner is manager of the vent at ticket creation
            _owner: _organizerAddress,
            _ticketCost: ticketCost,
            _onSale: true
        });

        _ticketList.push(newTicket);
    }

    function buy_ticket(uint ticketID) public payable
    {
        uint foundTicketIndex = getTicketIndexById(ticketID);

        require(_ticketList[foundTicketIndex]._onSale == true, "Error: Ticket is not on sale.");//check if buyer can buy the ticket
        require(msg.value == _ticketList[foundTicketIndex]._ticketCost, "Error: Ticket payment is not equal to ticket cost.");

        payable(_ticketList[foundTicketIndex]._owner).transfer(msg.value);//transfer money to current owner
        _ticketList[foundTicketIndex]._owner = msg.sender;//change owner to buyer
    }

    function setTicketSale(bool saleFlag, uint ticketID) public
    {
        uint foundTicketIndex = getTicketIndexById(ticketID);

        require(_ticketList[foundTicketIndex]._owner == msg.sender, "Error: Cannot change ticket sale state, wrong user");//restriced checks it

        _ticketList[foundTicketIndex]._onSale = saleFlag;
    }

    function getAllTickets() public view returns(Ticket[] memory) {
        return _ticketList;
    }

    /*function getTicketById(uint ticketID) public view returns(Ticket memory){
        Ticket memory foundTicket;
         for (uint i = 0; i < _ticketList.length; i++) {//find ticket by id
            if(_ticketList[i]._ticketID == ticketID)
            {
                foundTicket = _ticketList[i];
            }
        }

        return foundTicket;
    }*/

    //this is used instead of returning ticket, because solidity does not allow editing storage variable with memory variable. or I didnt manage it
    function getTicketIndexById(uint ticketID) public view returns(uint){
        Ticket memory foundTicket;
         for (uint i = 0; i < _ticketList.length; i++) {//find ticket index by id
            if(_ticketList[i]._ticketID == ticketID)
            {
                foundTicket = _ticketList[i];
                return i;
            }
        }

        revert("Ticket not found");
    }
}
