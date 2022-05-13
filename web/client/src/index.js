
import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { StoreProvider } from "./store/store";
import { initialState, userReducer } from "./store/userReducer";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider
        initialState={initialState}
        reducer={userReducer}
      >
        <App />
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>,

  document.getElementById("root"),
);