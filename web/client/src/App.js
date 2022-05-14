import React from "react";
import { Navigate } from "react-router";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import ErrorPage from "./pages/error-page/error-page.jsx";
import Events from './pages/events/events.jsx';
import Login from "./pages/login/login.jsx";
import AddEvent from "./pages/organizer-addEvent/organizer-addEvent";
import OrganizerLogin from "./pages/organizer-login/organizer-login.jsx";
import Signup from "./pages/signup/signup.jsx";
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
              path="/organizer-login"
              element={<OrganizerLogin />}
            />

            <Route
              path="/login"
              element={<Navigate to="/home"/>}
            />
            <Route
              path="/signup"
              element={<Navigate to="/home"/>}
            />
             <Route
              path="/events"
              element={<Events />}
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