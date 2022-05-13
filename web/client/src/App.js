import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/signup/signup.jsx";
import { useStore } from "./store/store";

function App() {
  const [state] = useStore();
  const { user: currentUser } = state;

  return (
    <React.Suspense fallback={<div>Loading...</div>} >
      <Routes>
          <>    
            <Route
              path="/signup"
              element={<Signup />}
            />
            <Route
              path="*"
              element={<Signup />}
            />
          </>
      </Routes>
    </React.Suspense>
  );
}

export default App;
