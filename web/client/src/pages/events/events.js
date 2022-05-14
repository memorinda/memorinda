import axios from 'axios';
import React, { useEffect, useState } from "react";
import { FaRegCalendarTimes } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
// import { Container, Nav, NavDropdown } from "react-bootstrap";
// import Navbar from "react-bootstrap/Navbar";
// import { userLogout } from "../../store/userReducer";
import { useNavigate } from "react-router-dom";
import "./events.scss";

function Events() {

  const [allEvents, setAllEvents] = useState([])
  const navigate = useNavigate();

  // const [searchQuery, setSearchQuery] = useState("");
  // const [state, dispatch] = useStore();
  // const { user: currentUser } = state;
  // // const [errorMessage, setErrorMessage] = useState();
  // const onSubmit = useCallback((data) => {
  //   // dispatch(userLogout());
  //   navigate("/login");
  // }, [dispatch, navigate]);



  // async function handleSearch() {
  //   navigate(`/eventSearch/${searchQuery}`);
  // }

  const fetchEvents = async () => {
    axios
    .get(`${process.env.REACT_APP_URL}/events`)
    .then((res) => {
      console.log(res.data);
      setAllEvents(res.data)
     
    })
    .catch((err) => {
      console.log("Error:", err);
      navigate("/error")
      
    });
  }

  const buyTicket = (eventID) => {
    console.log(eventID);
  }
  useEffect(() => {
    fetchEvents();
  }, [])

  return (
    <div className="events">
      <div className="event-header row mt-5 justify-content-center align-items-center">
        <div className="  col-5 align-self-center">
        <h3 >Current Events</h3>
        </div>
      </div>

    {allEvents.length > 0 ? 
      allEvents.map(event => {
        return(
          <div key={event._id} className="event-content row mt-5 justify-content-center align-items-center">
            <div className=" col-3 align-self-center">
              <div className="event-picture" >
              {/* <img src={defaultImage} alt='Event'/>  */}
              </div>
                
            </div>
            <div className="event-info col-9 align-items-left">
              <div className="row align-self-center">
                <h4>{event.eventName}</h4>
              </div>
              <div className="row align-self-center">
                <p>{event.eventDescription}</p>
              </div>
              <div className="row align-self-center">
                <div className="col-5 d-flex justify-content-start align-items-center">
                   <h6><span><FaRegCalendarTimes /></span>  {event.eventDate.slice(0,10)} {(new Date(event.eventDate)).toLocaleTimeString()}</h6>
                </div>
                <div className="col-5 d-flex justify-content-start align-items-center">
                  <h6> <span> <GrLocation /></span> {event.eventLocation}</h6>
                </div>
                <div className="col-2 d-flex justify-content-start align-items-center">
                <h6> Capacity: {event.eventCapacity}</h6>
                </div>
                 
              </div>
              <div className="row mt-4 justify-content-center">
              <button
                  type='button'
                  className="col-6 btn btn-block btn-success"
                  onClick={() => {buyTicket(event._id)}}
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
        <h4>No event yet</h4>
        </div>
      </div>
      
     
    }

      
    </div>

  );
}

export default Events;