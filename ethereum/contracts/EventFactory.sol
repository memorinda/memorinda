// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EventFactory {

    using Counters for Counters.Counter;
    Counters.Counter private _eventID;//keep track of event ids

    struct eventProperties {
        uint256 _eventID;
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
            _eventID: currEventID,
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

    function deployedEventsLength() public view returns (uint256) {
        uint totalEvents = _eventID.current();

        return totalEvents;
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

    function getEventsByID(uint256 eventID) public view returns(eventProperties memory) {
        return idToEvent[eventID];
    }

}

contract Event is ERC721URIStorage {

    uint256 public _eventID;
    address public _organizerAddress;
    using Counters for Counters.Counter;

    Counters.Counter private _ticketIds;
    Counters.Counter private _ticketsSold;

    mapping(uint256 => Ticket) private idToTicket;

    struct Ticket {
        uint _ticketID;
        uint _eventID;
        address _organizer;
        address _owner;
        uint _ticketCost;
        bool _onSale;
    }

    //name description capacity eventdate location price

    constructor (uint256 eventID, address creator) ERC721("Memorinda", "MEM") {
        _eventID = eventID;
        _organizerAddress = creator;
    }

    /*
        TICKET FUNCTIONS
    */

    modifier restricted() {
        require(msg.sender == _organizerAddress);
        _;
    }


    function createTicketsByAmount(string[] memory tokenURI, uint ticketCost, uint ticketAmount) public restricted {
        for (uint i = 0; i < ticketAmount; i++) {
            createTicket(tokenURI[i], ticketCost);
        }
    }

    //create a single ticket
    function createTicket(string memory tokenURI, uint ticketCost) public {
        _ticketIds.increment();
        uint256 newTokenId = _ticketIds.current();
        Ticket memory newTicket = Ticket({
            _ticketID: newTokenId,
            _eventID: _eventID,
            _organizer: _organizerAddress,//owner is manager of the vent at ticket creation
            _owner: _organizerAddress,
            _ticketCost: ticketCost,
            _onSale: true
        });
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        idToTicket[newTokenId] = newTicket;
    }

    function buy_ticket(uint256 ticketID) public payable {

        Ticket storage _currTicket = idToTicket[ticketID];
        require(_currTicket._onSale == true, "Error: Ticket is not on sale.");//check if buyer can buy the ticket
        require(msg.value == _currTicket._ticketCost, "Error: Ticket payment is not equal to ticket cost.");

        payable(_currTicket._owner).transfer(msg.value); //transfer money to current owner
        _currTicket._owner = msg.sender; //change owner to buyer
        _currTicket._onSale = false;
        _ticketsSold.increment();
    }

    function getTicketIndexBySale() public view returns(uint){
        uint totalTickets = _ticketIds.current();
        for (uint i = 0; i < totalTickets; i++){
            if(idToTicket[i+1]._onSale == true){
                return i;
            }
        }
        revert("All tickets are sold");
    }

    function buy_ticketFromEventID() public payable returns(uint)
    {
        uint foundTicketIndex = getTicketIndexBySale();

        require(idToTicket[foundTicketIndex]._onSale == true, "Error: Ticket is not on sale.");//check if buyer can buy the ticket
        require(msg.value == idToTicket[foundTicketIndex]._ticketCost, "Error: Ticket payment is not equal to ticket cost.");

        payable(idToTicket[foundTicketIndex]._owner).transfer(msg.value);//transfer money to current owner
        idToTicket[foundTicketIndex]._owner = msg.sender;//change owner to buyer
        idToTicket[foundTicketIndex]._onSale = false;
        _ticketsSold.increment();

        return foundTicketIndex;
    }

    function setTicketSale(bool saleFlag, uint256 ticketID) public {

        require(idToTicket[ticketID]._onSale == saleFlag, "Error: You cannot change ticket state to the same state");//restriced checks it
        require(idToTicket[ticketID]._owner == msg.sender, "Error: Cannot change ticket sale state, wrong user");//restriced checks it

        idToTicket[ticketID]._onSale = saleFlag;

        if (saleFlag) {
            _ticketsSold.decrement();
        } else {
            _ticketsSold.increment();
        }
    }

    function getAllTickets() public view returns(Ticket[] memory) {
        uint256 totalNumTickets = _ticketsSold.current();
        Ticket[] memory postTickets = new Ticket[](totalNumTickets);
        uint256 currInd = 0;
        for (uint256 i=0; i< totalNumTickets; i++) {
            if (idToTicket[i+1]._onSale == true) {
                postTickets[currInd] = idToTicket[i+1];

    function getTicketOwnerById(uint ticketID) public view returns(address) {
            uint foundIndex = getTicketIndexById(ticketID);

            return _ticketList[foundIndex]._owner;
        }
    

    /*
        MEMORINDA FUNCTIONS
    */
    Counters.Counter private _memorindaIds;
    Counters.Counter private _memorindaSold;
    Memorinda[] public _memorindaList;

    struct Memorinda {
        uint _memID;
        uint _eventID;
        address _organizer;
        address _owner;
        uint _memCost;
        bool _onSale;
    }

    function createMemorindaByAmount(uint price, uint amount) public {
        for (uint i = 0; i < amount; i++)
        {
            createMemorinda(price);
        }
    }

    //create a single ticket
    function createMemorinda(uint price) private {
        _memorindaIds.increment();
        Memorinda memory newMemorinda = Memorinda({
            _memID: _memorindaIds.current(),
            _eventID: _eventID,
            _organizer: _organizerAddress,//owner is manager of the vent at mem creation
            _owner: _organizerAddress,
            _memCost: price,
            _onSale: true
        });

        _memorindaList.push(newMemorinda);
    }

    function buy_memorinda(uint memorindaID) public payable
    {
        uint foundMemorindaIndex = getMemorindaIndexById(memorindaID);

        require(_memorindaList[foundMemorindaIndex]._onSale == true, "Error: Memorinda is not on sale.");//check if buyer can buy the ticket
        require(msg.value == _memorindaList[foundMemorindaIndex]._memCost, "Error: Payment is not equal to mem cost.");

        payable(_memorindaList[foundMemorindaIndex]._owner).transfer(msg.value);//transfer money to current owner
        _memorindaList[foundMemorindaIndex]._owner = msg.sender;//change owner to buyer
        _memorindaList[foundMemorindaIndex]._onSale = false;
        _memorindaSold.increment();
    }

    function setMemorindaSale(bool saleFlag, uint ticketID) public {
        uint foundMemorindaIndex = getMemorindaIndexById(ticketID);

        require(_memorindaList[foundMemorindaIndex]._onSale == saleFlag, "Error: You cannot change mem state to the same state");//restriced checks it
        require(_memorindaList[foundMemorindaIndex]._owner == msg.sender, "Error: Cannot change mem sale state, wrong user");//restriced checks it

        _memorindaList[foundMemorindaIndex]._onSale = saleFlag;

        if (saleFlag) {
            _memorindaSold.decrement();
        } else {
            _memorindaSold.increment();
        }
    }

    function getAllMemorindas() public view returns(Memorinda[] memory) {
        return _memorindaList;
    }

    //this is used instead of returning ticket, because solidity does not allow editing storage variable with memory variable. or I didnt manage it
    function getMemorindaIndexById(uint memorindaID) public view returns(uint){
         for (uint i = 0; i < _memorindaList.length; i++) {//find ticket index by id
            if(_memorindaList[i]._memID == memorindaID)
            {
                return i;
            }
        }
        revert("Memorinda not found");
    }
}
