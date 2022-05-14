import React from "react";

// eslint-disable-next-line react/prop-types
function Layout({ children }) {
  return (
    <div className="layout">

      <div className="row">
        <div className="col-12 px-0">
          {children}
        </div>

      </div>
  
    </div>
  );
}

export default Layout;
