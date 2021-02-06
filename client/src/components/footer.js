import React, { useState, useEffect } from "react";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";
import "./navbar.scss";

const Example = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSigninFor, setShowSigninForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [username, setUsername] = useState("");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const accessString = localStorage.getItem("JWT");
    if (accessString == null) {
      setAuthorized(false);
    } else {
      try {
        const username = localStorage.getItem("USERNAME");

        setUsername(username);
        setAuthorized(true);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const toggle = () => setIsOpen(!isOpen);

  const showSigninFormHandler = () => {
    setShowSigninForm(true);
    setShowSignupForm(false);
  };

  const showSignupFormHandler = () => {
    setShowSigninForm(false);
    setShowSignupForm(true);
  };

  const hideSigninFormHandler = () => {
    setShowSigninForm(false);
    setShowSignupForm(false);
  };
  //Logout User
  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "/";
  };
  const year = new Date().getFullYear();

  return (
    <div>
      <Navbar color="dark" light expand="md">
        <NavbarBrand className="text-light" href="/">
          <h6> CRUD para Estudiantes, es un desarrollo creado por Camilo Giraldo. Derechos reservados {year} &copy; </h6>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {!authorized ? (
              <>
                
              </>
            ) : (
              <NavItem>
                <div>
                  <span className="text-light">
                    <i className="fas fa-user"></i>&nbsp;{" "}
                    <span className="ml-2 mr-2">{username}</span>
                  </span>{" "}
                  <button
                    className="btn btn-primary text-light "
                    onClick={handleLogOut}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Example;
