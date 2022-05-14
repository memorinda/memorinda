// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";

contract EventFactory {

    using Counters for Counters.Counter;
    Counters.Counter private _eventID;//keep track of event ids

    struct eventProperties {
        string _eventName;
        string _eventDescription;
        address _eventAdress;
        int _longtitude;
        int _latitude;
        int _eventTimestamp;
        int _eventCapacity;
    }

    mapping(uint256 => eventProperties) private idToEvent;

    mapping(address => Event[]) private organizerToEvent;

    function createEvent( string memory eventName, string memory eventDescription, int longtitude, int latitude, int eventTimestamp, int eventCapacity) public {
        _eventID.increment();
        uint256 currEventID = _eventID.current();
        Event newEvent = new Event(currEventID, msg.sender);
        
        idToEvent[currEventID] = eventProperties({
            _eventName: eventName,
            _eventDescription: eventDescription,
            _eventAdress: address(newEvent),
            _longtitude: longtitude,
            _latitude: latitude,
            _eventTimestamp: eventTimestamp,
            _eventCapacity: eventCapacity
        });

        organizerToEvent[msg.sender].push(newEvent);

    }

    function getDeployedEvents() public view  returns (eventProperties[] memory) {
        uint256 totalEvents = _eventID.current();
        eventProperties[] memory events = new eventProperties[](totalEvents);
        for (uint i=0; i<totalEvents; i++) {
            events[i] = idToEvent[i+1];
        }
        return events;
    }

    function getEventsByOrganizer(address organizerAddress) public view returns(Event[] memory) {
        return organizerToEvent[organizerAddress];
    }

}

contract Event{

    uint256 public _eventID;
    address public _organizerAddress;
    using Counters for Counters.Counter;
    Counters.Counter private _ticketIds;
    Counters.Counter private _ticketsSold;
    Ticket[] public _ticketList;

    struct Ticket {
        uint _ticketID;
        uint _eventID;
        address _organizer;
        address _owner;
        uint _ticketCost;
        bool _onSale;
    }
    //name description capacity eventdate location price
    constructor (uint256 eventID, address creator) {
        _eventID = eventID;
        _organizerAddress = creator;
    }

    function createTicketsByAmount(uint ticketCost, uint ticketAmount) public {
        for (uint i = 0; i < ticketAmount; i++)
        {
            createTicket(ticketCost);
        }
    }

    //create a single ticket
    function createTicket(uint ticketCost) private {
        _ticketIds.increment();
        Ticket memory newTicket = Ticket({
            _ticketID: _ticketIds.current(),
            _eventID: _eventID,
            _organizer: _organizerAddress,//owner is manager of the vent at ticket creation
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
        _ticketList[foundTicketIndex]._onSale = false;
        _ticketsSold.increment();
    }

    function setTicketSale(bool saleFlag, uint ticketID) public {
        uint foundTicketIndex = getTicketIndexById(ticketID);

        require(_ticketList[foundTicketIndex]._onSale == saleFlag, "Error: You cannot change ticket state to the same state");//restriced checks it
        require(_ticketList[foundTicketIndex]._owner == msg.sender, "Error: Cannot change ticket sale state, wrong user");//restriced checks it

        _ticketList[foundTicketIndex]._onSale = saleFlag;

        if (saleFlag) {
            _ticketsSold.decrement();
        } else {
            _ticketsSold.increment();
        }
    }

    function getAllTickets() public view returns(Ticket[] memory) {
        return _ticketList;
    }

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
