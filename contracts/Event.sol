pragma solidity ^0.4.17;
//https://soliditydeveloper.com/ecrecover TODO

contract Event{
    struct Ticket 
    {
        address  manager;
        uint ticketCost;
        address owner;
        bool onSale;
        uint ticketID;
        uint ticketHash;
    }

    string public caption;
    uint public eventID;
    uint public ticketAmount;
    address public managerAddress;
    Ticket[] public ticketList;

    function Event(string _caption, uint _eventID, uint _ticketAmt, uint _ticketCost) public 
    {
        caption = _caption;
        eventID = _eventID;
        ticketAmount = _ticketAmt;
        managerAddress = msg.sender;

        //create tickets
        for (uint i = 0; i < _ticketAmt; i++) {
            createTicket(_ticketCost, managerAddress, i);
        }
    }

    // to create ticket
    function createTicket(uint _ticketCost, address _manager, uint id) 
    {
        Ticket memory newTicket = Ticket({
            manager: _manager,
            ticketCost: _ticketCost,
            owner: _manager,
            onSale: true,
            ticketID: id,//?
            ticketHash: 111
        });

        //create hash and id
        ticketList.push(newTicket);
    }

    /*function createTicketID(){
        return 1;
    }

    function createTicketHash(){
        return 111;
    }*/

    function buy_ticket(uint _ticketID) public payable
    {
        Ticket foundTicket;
        for (uint i = 0; i < ticketAmount; i++) {
            if(ticketList[i].ticketID == _ticketID)
            {
                foundTicket = ticketList[i];
            }
        }

        require(foundTicket.onSale == true, "Error: Ticket is not on sale.");
        require(msg.value == foundTicket.ticketCost, "Error: Ticket payment is not equal to ticket cost.");

        foundTicket.owner = msg.sender;
    }

    function setTicketSale(bool saleFlag, uint _ticketID)
    {
        Ticket foundTicket;
        for (uint i = 0; i < ticketAmount; i++) {
            if(ticketList[i].ticketID == _ticketID)
            {
                foundTicket = ticketList[i];
            }
        }

        require(foundTicket.owner == msg.sender, "Error: Cannot change ticket sale state, wrong");
        foundTicket.onSale = saleFlag;
    }

}
    




