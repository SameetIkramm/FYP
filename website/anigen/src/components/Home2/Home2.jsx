import React from 'react';
import About from '../About/about';
import Difference from '../Difference/difference';
import Service from '../Services/services';
import Contact from '../Contact/contact';
import Login from '../LogIn/Login';
import {NavLink} from 'react-router-dom';
import {useLocation} from 'react-router-dom';
const Home2 = () => {
  const location=useLocation()
  return (
    <div>
    <section id="home">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 mt-5">
            <h1 className="display-4 fw-bolder mb-4 text-center text-white">
              ANIGEN
            </h1>
            <h2 className="display-4 mb-4 text-center text-white">
              An Automated Urdu Spokeperson
            </h2>
            <p className='lead text-center fs-4 mb-5 text-white'>
              <h1>Welcome {location.state.id} </h1>
            </p>
            <div className="buttons d-flex justify-content-center">
              <NavLink to="/contact" className="btn btn-light me-4 rounded-pill px-4 py-2">Get Quote</NavLink>
              <NavLink to="/register" className="btn btn-outline-primary py-2 me-4 px-4 rounded-pill" style={{ color: "white", borderColor: "white" }}>Register</NavLink>
            </div>
          </div>
        </div>
      </div>
    </section>
    <About/>
    <Difference/>
    <Service/>
    <Contact/>
    </div>
  );
}

export default Home2;
