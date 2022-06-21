import { useEffect, useState } from "react";
import { FaRegCalendarTimes } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
// import { Container, Nav, NavDropdown } from "react-bootstrap";
// import Navbar from "react-bootstrap/Navbar";
// import { userLogout } from "../../store/userReducer";
import { useNavigate } from "react-router-dom";
import { useContract } from '../../providers/ContractProvider';
import { useMetamask } from '../../providers/MetaMaskProvider';
import { useStore } from '../../store/store';
import ABI from '../../abis/Event.json';

import { userLogout } from '../../store/userReducer';
import "./user-tickets.scss";

function UserTickets() {
  const [state] = useStore();
  const { user: currentUser } = state;
  const [, dispatch] = useStore();

  const [userTickets, setUserTickets] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const navigate = useNavigate();
  const {contract: eventFactory, web3js} = useContract();
  const account = useMetamask();


  const fetchTickets = async () => {
    console.log(account);

    const eventIDs = await eventFactory.methods.getEventsByOrganizer(account).call();
    var get_events = await eventFactory.methods.getDeployedEvents().call();
    setAllEvents(get_events);

    var allTickets = [];
    for (let i = 0; i < eventIDs.length; i++) {
        const eventContract = await new web3js.eth.Contract(ABI.abi, get_events[i]._eventAddress);        
        const userEventTickets = await eventContract.methods.getAllTicketsByUserAddress(account).call();
        if (userEventTickets) {
            allTickets = allTickets.concat(userEventTickets);
        }
    }
    setUserTickets(allTickets);
    console.log(allTickets);
  }

  useEffect(() => {
    fetchTickets();
  }, [account, setAllEvents, setUserTickets])

  return (
    <div className="events">
     <div className="event-navbar row justify-content-end align-items-center">

     <div className="col-2">
          <button
            type='button'
            className="btn btn btn-primary"
            onClick={() => {
              navigate("/verify");
            }}
          >
               Verify A Ticket
          </button>
        </div>
     <div className="col-2">
          <button
            type='button'
            className="btn btn-block btn-success"
            onClick={() => {
              navigate("/add-event");
            }}
          >
               Add Event
          </button>
        </div>
        
        <div className="col-2">
          <button
            type='button'
            className="btn btn-block btn-secondary"
            onClick={() => {
              dispatch(userLogout());
              navigate("/organizer-login");
            }}
          >
               LOGOUT
          </button>
        </div>

      </div>
      <div className="event-header row mt-5 justify-content-center align-items-center">
        <div className="  col-5 align-self-center">
        <h3 >Upcoming Events</h3>
        </div>
      </div>

    {(userTickets.length >= 1 && allEvents.length >= 1) ? 
      userTickets.map(ticket => {
        return(
          <div key={ticket._eventID+"/"+ticket._ticketID} className="event-content row mt-5 justify-content-center align-items-center">
            <div className=" col-3 align-self-center">
              <div className="event-picture" >
              </div>
            </div>
            <div className="event-info col-9 align-items-left">
              <div className="row align-self-center">
                <h4>{allEvents[parseInt(ticket._eventID)-1]._eventName}</h4>
              </div>
              <div className="row align-self-center">
                <p>{allEvents[parseInt(ticket._eventID)-1]._eventDescription}</p>
              </div>
              <div className="row align-self-center">
                <div className="col-5 d-flex justify-content-start align-items-center">
                   <h6><span><FaRegCalendarTimes /></span>  {(new Date(parseInt(allEvents[parseInt(ticket._eventID)-1]._eventTimestamp)).toString()).slice(0, 21)} </h6>
                </div>
                <div className="col-5 d-flex justify-content-start align-items-center">
                  <h6> <span> <GrLocation /></span> {allEvents[parseInt(ticket._eventID)-1]._longtitude} , {allEvents[parseInt(ticket._eventID)-1]._latitude}</h6>
                </div>
                <div className="col-2 d-flex justify-content-start align-items-center">
                <h6> Capacity: {allEvents[parseInt(ticket._eventID)-1]._eventCapacity}</h6>
                </div>
                <div className="col-2 d-flex justify-content-start align-items-center">
                <h6> Ticket Price: {ticket._ticketCost}</h6>
                </div>
                 
              </div>
            </div>
            
           
          </div>
        )
      }) :
      <div className=" row mt-5 justify-content-center align-items-center">
        <div className="  col-5 align-self-center">
        <h4>No event yet</h4>
        </div>
      </div>
      
     
    }

      
    </div>

  );
}

export default UserTickets;