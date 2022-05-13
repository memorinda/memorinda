import React from "react";
import Sidebar from "../sidebar/sidebar.jsx.js";

// eslint-disable-next-line react/prop-types
function Layout({ children }) {
  return (
    <div className="layout">
      <div className="row">
        <div className="col-3 px-0 mb-5">
          <Sidebar/>
        </div>
        <div className="col-9 px-0">
          {children}
        </div>

      </div>
  
    </div>
  );
}

export default Layout;
