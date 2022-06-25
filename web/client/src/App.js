import React from "react";
import { Navigate } from "react-router";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import CreateTicket from "./pages/create-ticket/create-ticket";
import ErrorPage from "./pages/error-page/error-page.jsx";
import Events from './pages/events/events.jsx';
import Login from "./pages/login/login.jsx";
import AddEvent from "./pages/organizer-addEvent/organizer-addEvent";
import OrganizerEvents from "./pages/organizer-events/organizer-events";
import OrganizerLogin from "./pages/organizer-login/organizer-login.jsx";
import Signup from "./pages/signup/signup.jsx";
import UploadPhoto from './pages/upload-photo/upload-photo';
import Verify from './pages/verify/verify';
import { useStore } from "./store/store";
import UserTickets from "./pages/user-tickets/user-tickets";
import EventTickets from "./pages/event-tickets/event-tickets";



function App() {
  const [state] = useStore();
  const { user: currentUser } = state;
  const { organizerUser } = state;

  return (
    <React.Suspense fallback={<div>Loading...</div>} >
      <Routes>
        {
          !currentUser && !organizerUser ?
          <>
            <Route
              path="/"
              element={<Events />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/organizer-login"
              element={<OrganizerLogin />}
            />
            <Route
              path="/signup"
              element={<Signup />}
            />
             <Route
              path="/events"
              element={<Events />}
            />
            <Route
              path="*"
              element={<Login />}
            />
          </>
           : 
          !organizerUser ?   
             <>
             <Route
                path="/login"
                element={<Navigate to="/events"/>}
              />
              <Route
                path="/signup"
                element={<Navigate to="/events"/>}
              />
              <Route
                path="/events"
                element={<Events />}
              />
              <Route
                path="/user-tickets"
                element={<UserTickets />}
              />
              <Route
                path="/event-tickets/:id"
                element={<EventTickets />}
              />
              <Route
                path="/upload-photo"
                element={<UploadPhoto />}
              />
              <Route
                path="/"
                element={<Events />}
              />
              <Route
                path="*"
                element={<ErrorPage />}
              />
            </>
            
            : 
            <>
              <Route
                path="/"
                element={<AddEvent />}
              />

              <Route
                path="/add-event"
                element={<AddEvent />}
              />

              <Route
                path="/create-ticket"
                element={<CreateTicket />}
              />

              <Route
                path="/organizer-login"
                element={<AddEvent />}
              />
              <Route
                path="/organizer-events"
                element={<OrganizerEvents />}
              />
              <Route
                path="/create-ticket/:id"
                element={<CreateTicket />}
              />
              <Route
                path="/verify"
                element={<Verify />}
              />
              <Route
                path="*"
                element={<ErrorPage />}
              />
          </>
               
          
        }
      </Routes>
    </React.Suspense>
  );
}

export default App;