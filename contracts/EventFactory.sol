pragma solidity ^0.4.17;
//https://soliditydeveloper.com/ecrecover TODO: signature

contract EventFactory{

    address[] public deployedEvents;

    function createEvent(string caption, uint ticketAmount, uint ticketCost) public {
        address newEvent = new Event(caption, ticketAmount, ticketCost, msg.sender);
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
    uint public _ticketCost;
    TicketFactory _ticketFactory;
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
    function Event(string caption, uint ticketAmt, uint ticketCost, address creator) public 
    {
        _caption = caption;
        _ticketAmount = ticketAmt;
        _managerAddress = creator;
        _ticketCost = ticketCost;
        //TODO: create event ids

        //create tickets
        if(_ticketAmount > 0)
        {
            _ticketFactory = new TicketFactory(_caption, _id, _ticketCost, _ticketAmount, _managerAddress);
            //createTicket(ticketCost, _managerAddress, i, _id);
        }
        
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






