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
import "./user-tickets.scss";
import { array } from "zod";

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

    var get_events = await eventFactory.methods.getDeployedEvents().call();
    setAllEvents(get_events);
    var allTickets = [];
    for (let i = 0; i < get_events.length; i++) {
        
        const eventContract = await new web3js.eth.Contract(ABI.abi, get_events[i]._eventAddress);        
        const eventTickets = await eventContract.methods.getAllTicketsByUserAddress(account).call();
        const userEventTickets = eventTickets.filter(item => item._isActive === true);
        
        console.log(userEventTickets);

        if (userEventTickets) {
            allTickets = allTickets.concat(userEventTickets);
        }
    }
    setUserTickets(allTickets);
    console.log(allTickets);
  }

  const changeTicketSale = async(ticketID, event) => {
    if (!currentUser) {
      navigate("/login");
    } 
    else {
            const eventContract = await new web3js.eth.Contract(ABI.abi, event._eventAddress);        
            
            const ticketResponse = await eventContract.methods.setTicketSaleOpp(ticketID).send({from:account});
            console.log(ticketResponse);
            //TRY CATHCI SILDIM PATLAR MI?
    }
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
        <h3 >My Tickets</h3>
        </div>
      </div>

    {(userTickets.length >= 1 && allEvents.length >= 1) ? 
      userTickets.map(ticket => {
        return(
          <div key={ticket._eventID+"/"+ticket._ticketID} className="event-content row mt-5 justify-content-center align-items-center">
            <div className=" col-3 align-self-center">
              <div>
                  <SimpleImageSlider
                      width={120}
                      height={120}
                      navSize={15}
                      navMargin={3}
                      images={ticket._organizerImageLinks}
                      showBullets={false}
                      showNavs={true}
                  />
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
                <div className="col-2 d-flex justify-content-start align-items-center">
                <h6> Ticket ID: {ticket._ticketID}</h6>
                </div>
                <div className="col-2 d-flex justify-content-start align-items-center">
                <h6> Ticket Is On Sale: {ticket._onSale.toString()}</h6>
                </div>

                <div className="col-sm-3 mb-3 align-self-center">
                    <button
                        type='button'
                        className="upload-btn btn btn-block btn-success"
                        onClick={() => changeTicketSale(ticket._ticketID, allEvents[parseInt(ticket._eventID)-1])}
                    >
                    Change Ticket Sale
                    </button>
                </div>
                
                <div className="col-sm-3 mb-3 align-self-center">
                    <button
                        type='button'
                        className="upload-btn btn btn-block btn-success"
                        onClick={() => navigate(`/upload-photo/${ticket._eventID+"/"+ticket._ticketID}`)}
                    >
                    Upload Memorinda
                    </button>
                </div>
                <div className=" col-3 align-self-center">
                  {(ticket._ownerImageLinks.length > 0) ?
              (<div>
                  <SimpleImageSlider
                      width={120}
                      height={120}
                      navSize={15}
                      navMargin={3}                      
                      images={ticket._ownerImageLinks}
                      showBullets={false}
                      showNavs={true}
                  />
                </div>) :
                <div></div>
          }
            </div>

                
                 
              </div>
            </div>
            
           
          </div>
        )
      }) :
      <div className=" row mt-5 justify-content-center align-items-center">
        <div className="  col-5 align-self-center">
        <h4>No tickets yet</h4>
        </div>
      </div>
      
     
    }

      
    </div>

  );
}

export default UserTickets;