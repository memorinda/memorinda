import React from "react";
import { Navigate } from "react-router";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import CreateTicket from "./pages/create-ticket/create-ticket";
import ErrorPage from "./pages/error-page/error-page.jsx";
import Events from './pages/events/events.jsx';
import Login from "./pages/login/login.jsx";
import OrganizerEvents from "./pages/organizer-events/organizer-events";
import AddEvent from "./pages/organizer-addEvent/organizer-addEvent";
import OrganizerLogin from "./pages/organizer-login/organizer-login.jsx";
import Signup from "./pages/signup/signup.jsx";
import UploadPhoto from './pages/upload-photo/upload-photo';
import Verify from './pages/verify/verify';
import { useStore } from "./store/store";

function App() {
  const [state] = useStore();
  const { user: currentUser } = state;

  return (
    <React.Suspense fallback={<div>Loading...</div>} >
      <Routes>
        {!currentUser ?
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
          </> :
          <>
      
            <Route
              path="/"
              element={<Login />}
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
              element={<OrganizerLogin />}
            />

            <Route
              path="/create-ticket/:id"
              element={<CreateTicket />}
            />

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
              path="/organizer-events"
              element={<OrganizerEvents />}
            />
             <Route
              path="/verify"
              element={<Verify />}
            />
            <Route
              path="/upload-photo"
              element={<UploadPhoto />}
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