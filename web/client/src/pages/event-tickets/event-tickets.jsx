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

import SimpleImageSlider from "react-simple-image-slider";
import { userLogout } from '../../store/userReducer';
import "./event-tickets.scss";

function EventTickets() {
  const [state] = useStore();
  const { user: currentUser } = state;
  const [, dispatch] = useStore();

  const [errorMessage, setErrorMessage] = useState("");
  const [eventTickets, setEventTickets] = useState([]);
  const [event, setEvent] = useState({});
  const navigate = useNavigate();
  const {contract: eventFactory, web3js} = useContract();
  const account = useMetamask();

  const eventID = window.location.pathname.slice(15);

  const fetchTickets = async () => {
    console.log(eventID);
    try {
        const eventObj = await eventFactory.methods.getEventsByID(eventID).call();
        console.log(eventObj);
        setEvent(eventObj);
        if (eventObj._eventAddress) {
            var allTickets = [];
            console.log(eventObj);
            const eventContract = await new web3js.eth.Contract(ABI.abi, eventObj._eventAddress);        
            const userEventTickets = await eventContract.methods.getAllTickets().call();
            console.log(userEventTickets);
            if (userEventTickets) {
                allTickets = allTickets.concat(userEventTickets);
            }
            
            setEventTickets(allTickets);
            console.log(allTickets);
        }
    }
    catch(err) {
        console.log(err);
    }
  }

  const buyTicket = async (ticket) => {   
    if (!currentUser) {
        navigate("/login");
    } 
    else {
        try {
            const eventContract = await new web3js.eth.Contract(ABI.abi, event._eventAddress);        
            
            const ticketResponse = await eventContract.methods.buyTicketFromID(ticket._ticketID).send({from: account, value: ticket._ticketCost});
            console.log(ticketResponse);
        }

        catch(err) {
        setErrorMessage(err);
        }
    }
    

  }

  useEffect(() => {
    fetchTickets();
  }, [account, setEvent])


  return (
    <div className="events">
     <div className="event-navbar row justify-content-end align-items-center">

     {/* <div className="col-2">
          <button
            type='button'
            className="btn btn btn-primary"
            onClick={() => {
              navigate("/verify");
            }}
          >
               Verify A Ticket
          </button>
        </div> */}
     <div className="col-2">
          <button
            type='button'
            className="btn btn-block btn-success"
            onClick={() => {
              navigate("/events");
            }}
          >
              Events
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
        <h3 >Event Tickets</h3>
        </div>
      </div>

    {(eventTickets.length >= 1) ? 
      eventTickets.map(ticket => {
        return(
          <div key={ticket._eventID+"/"+ticket._ticketID} className="event-content row mt-5 justify-content-center align-items-center">
            <div className=" col-3 align-self-center">
                <div>
                    <SimpleImageSlider
                        width={120}
                        height={120}
                        navSize={10}
                        images={ticket._organizerImageLinks}
                        showBullets={true}
                        showNavs={true}
                    />
                </div>
            </div>
            <div className="event-info col-9 align-items-left">
              <div className="row align-self-center">
                <h4>{event._eventName}</h4>
              </div>
              <div className="row align-self-center">
                <p>{event._eventDescription}</p>
              </div>
              <div className="row align-self-center">
                <div className="col-5 d-flex justify-content-start align-items-center">
                   <h6><span><FaRegCalendarTimes /></span>  {(new Date(parseInt(event._eventTimestamp)).toString()).slice(0, 21)} </h6>
                </div>
                <div className="col-5 d-flex justify-content-start align-items-center">
                  <h6> <span> <GrLocation /></span> {event._longtitude} , {event._latitude}</h6>
                </div>
                <div className="col-2 d-flex justify-content-start align-items-center">
                <h6> Capacity: {event._eventCapacity}</h6>
                </div>
                <div className="col-2 d-flex justify-content-start align-items-center">
                <h6> Ticket Price: {ticket._ticketCost}</h6>
                </div>
              </div>
              <div className="row mt-4 justify-content-center">
              <button
                  type='button'
                  className="col-6 btn btn-block btn-success"
                  onClick={() => {buyTicket(ticket)}}
                >
                      BUY TICKET
                </button>
              </div>
            </div>
            
           
          </div>
        )
      }) :
      <div className=" row mt-5 justify-content-center align-items-center">
        <div className="  col-5 align-self-center">
        <h4>No tickets left</h4>
        </div>
      </div>
      
     
    }

      
    </div>

  );
}

export default EventTickets;