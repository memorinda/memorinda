import axios from 'axios';
import React, { useEffect, useState } from "react";
import { FaRegCalendarTimes } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
// import { Container, Nav, NavDropdown } from "react-bootstrap";
// import Navbar from "react-bootstrap/Navbar";
// import { userLogout } from "../../store/userReducer";
import { useNavigate } from "react-router-dom";
import { useStore } from '../../store/store';
import { useContract } from '../../providers/ContractProvider';
import { useMetamask } from '../../providers/MetaMaskProvider';

import ABI from '../../abis/Event.json';
import "./organizer-events.scss";
import { userLogout } from '../../store/userReducer';

function OrganizerEvents() {
  const [state] = useStore();
  const { organizerUser: currentUser } = state;
  const [, dispatch] = useStore();

  const [allOrganizerEvents, setAllOrganizerEvents] = useState([])
  const navigate = useNavigate();
  const {contract: eventFactory, web3js} = useContract();
  const account = useMetamask();


  const fetchEvents = async () => {
    console.log(account);
    //console.log(await eventFactory.methods.getAllTickets().call());
    const eventIDs = await eventFactory.methods.getEventsByOrganizer(account).call();
    const events = await eventFactory.methods.getDeployedEvents().call();

    const organizerEvents = [];
    for (let i = 0; i < events.length; i++) {
      for (let j = 0; j < eventIDs.length; j++) {
        if (events[i]._eventAddress === eventIDs[j]) {
          organizerEvents.push(events[i]);
        }
      }
    }
    setAllOrganizerEvents(organizerEvents);
    console.log(organizerEvents);
  }

  useEffect(() => {
    fetchEvents();
  }, [account])

  return (
    <div className="events">
     <div className="event-navbar row justify-content-end align-items-center">

     
     <div className="col-1">
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
        
        <div className="col-1">
          <button
            type='button'
            className="btn btn-block btn-success"
            onClick={() => {
              dispatch(userLogout());
              navigate("/login");
            }}
          >
               LOGOUT
          </button>
        </div>

        <div className="col-2">
          <button
            type='button'
            className="btn btn-block btn-secondary"
            onClick={() => {
              navigate("/organizer-login")
            }}
          >
               ORGANIZER
          </button>
        </div>

      </div>
      <div className="event-header row mt-5 justify-content-center align-items-center">
        <div className="  col-5 align-self-center">
        <h3 >Upcoming Events</h3>
        </div>
      </div>

    {allOrganizerEvents.length > 0 ? 
      allOrganizerEvents.map(event => {
        return(
          <div key={event._eventAddress} className="event-content row mt-5 justify-content-center align-items-center">
            <div className=" col-3 align-self-center">
              <div className="event-picture" >
              {/* <img src={defaultImage} alt='Event'/>  */}
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

export default OrganizerEvents;