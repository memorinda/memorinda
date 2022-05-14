pragma solidity ^0.4.17;
//https://soliditydeveloper.com/ecrecover TODO

contract EventFactory{

    address[] public deployedEvents;

    function createEvent() public {
        address newEvent = new Event();
        deployedEvents.push(newEvent);
    }

    function getDeployedEvents() public view returns(address[]) {
        return deployedEvents;
    }

}

contract Event{

    string public _caption;
    uint public _id;
    uint public _ticketAmount;
    address public _managerAddress;

    Ticket[] public _ticketList;

    struct Ticket 
    {
        uint _ticketID;
        uint _eventID;
        address _manager;
        address _owner;
        uint _ticketCost;
        bool _onSale;
        //uint ticketHash;
    }

    //name description capacity eventdate location price 
    function Event(string caption, uint ticketAmt, uint ticketCost, address creator) public 
    {
        _caption = caption;
        //createEventId()
        _ticketAmount = ticketAmt;
        _managerAddress = creator;

        //create tickets
        if(_ticketAmount > 0)
        {
            for (uint i = 0; i < _ticketAmount; i++) {
                createTicket(ticketCost, _managerAddress, i, _id);
            }
        }
        
    }

    /*modifier restricted() {
        require(msg.sender == _owner, "Error: Cannot change object properties, wrong owner");
        _;
    }*/

    function createTicket(uint ticketCost, address manager, uint ticketID, uint eventID) private//TODO change id counter
    {
        Ticket memory newTicket = Ticket({
            _ticketID: id,
            _eventID: eventID,
            _manager: manager,//owner is manager of the vent at ticket creation
            _owner: manager,
            _ticketCost: ticketCost,
            _onSale: true
        });

        //create hash and id
        _ticketList.push(newTicket);
    }

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
}
    
contract Ticket{

    string public _eventCaption
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

    function Ticket(string eventCaption, uint eventID, uint cost) public restricted{
        _eventCaption = eventCAption;
        _eventID = eventID;
        _cost = cost;

        //set id
        
    }

    modifier restricted() {
        require(msg.sender == _owner, "Error: Cannot change ticket sale state, wrong user");
        _;
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




