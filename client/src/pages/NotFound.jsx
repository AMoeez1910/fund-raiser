import React from 'react'

const NotFound = () => {
  return (
    <section className="py-5 mt-5">
      <div className="container">
        <div className="row row-cols-1 d-flex justify-content-center align-items-center">
          <div className="col-md-10 text-center">
            <img className="img-fluid w-100" src="illustrations/404.svg" />
          </div>
          <div className="col text-center">
            <h2 className="display-3 fw-bold mb-4">Page Not Found</h2>
            <p className="fs-4 text-muted">
              Fusce adipiscing sit, torquent porta pulvinar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFound
