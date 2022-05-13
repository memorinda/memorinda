import React from "react";
import "./error-page.scss";

function ErrorPage() {
  return (
    <div className=
      " error-page jumbotron d-flex  justify-content-center min-vh-100"
    >
      <div className="row justify-content-center align-items-end">
        <div className="col-md-12 align-items-end">
          <div className="error-template">
            <p>
                    404 Not Found
            </p>
            <div className="error-details">
                    Sorry, an error has occured, Requested page not found!
            </div>
            <div className="error-actions">
              <a
                href="/"
                className="btn btn-primary btn-md col-4"
              ><span className="glyphicon glyphicon-home"></span>
                        Take Me Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
