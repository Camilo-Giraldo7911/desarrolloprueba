import React, { Component } from "react";
// import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";
import "./signup.scss";

class Signup extends Component {
  state = {
    Name: "",
    username: "",
    email: "",
    celular: "",
    password: "",
    password2: "",
    errorMessage: "",
    loggedIn: false,
    showError: false,
    showNullError: false,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const { Name, email, celular, password, password2 } = this.state;
    if (
      Name === "" ||
      email === "" ||
      celular === "" ||
      password === "" ||
      password2 === ""
    ) {
      return this.setState({
        showError: false,
        showNullError: true,
        loggedIn: false,
        errorMessage: "Todos los campos son obligatorios!",
      });
    }
    if (this.state.password !== this.state.password2) {
      return this.setState({
        errorMessage: "Los passwords no coinciden!",
      });
    } else {
      try {
        const newUser = {
          Name,
          username: Name,
          email,
          celular,
          password,
          userType: "client",
        };
        const response = await axios.post("/auth/signup", newUser);

        if (response.data.status === 400) {
          return this.setState({
            errorMessage: response.data.message,
          });
        }

        this.setState({
          loggedIn: true,
          showError: false,
          showNullError: false,
          errorMessage: "",
        });
        alert("Ya puede iniciar sesion!");
        window.location.reload();
      } catch (error) {
        console.error(error.response);
        this.setState({
          errorMessage: error.response.data.message,
        });
      }
    }
  };
  render() {
    return (
      <div className="container__signinPage">
        <div className=" form-box-signin">
          <form className="form-signin" onSubmit={this.handleSubmit.bind(this)}>
            <h2 className="signin-title">
              <h1> Crea tu cuenta, Comienza a Estudiar </h1>
            </h2>
            <hr />
            <div className="form-group-signup">
              <label className="label-form-signup" htmlFor="firstName">
                <p>Nombre</p>
              </label>
              <input
                name="Name"
                className="signup-input"
                type="firstName"
                id="firstName"
                placeholder="Tu Nombre y Apellido"
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group-signup">
              <label className="label-form-signup" htmlFor="email">
                <p>Email</p>
              </label>
              <input
                name="email"
                className="signup-input"
                type="email"
                id="email"
                placeholder="Email"
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group-signup">
              <label className="label-form-signup" htmlFor="password">
                <p>Numero Celular</p>
              </label>
              <input
                name="tel"
                className="signup-input"
                type="tel"
                id="tel"
                min="10"
                max="10"
                placeholder="Celular"
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group-signup">
              <label className="label-form-signup" htmlFor="password">
                <p>Password</p>
              </label>
              <input
                name="password"
                className="signup-input"
                type="password"
                id="password"
                placeholder="Password"
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group-signup">
              <label className="label-form-signup" htmlFor="password">
                <p>Confirme Password</p>
              </label>
              <input
                name="password2"
                className="signup-input"
                type="password"
                id="password2"
                placeholder="Confirme Password"
                onChange={this.handleChange}
              />
            </div>
            <button className="signup-btn">Registrate</button>
            <h4 className="signin-form-err-msg">{this.state.errorMessage}</h4>
          </form>
        </div>
      </div>
    );
  }
}

export default Signup;
