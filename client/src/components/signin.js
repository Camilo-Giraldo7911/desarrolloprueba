import React, { Component } from "react";
import axios from "axios";
import "./signin.scss";

class SignIn extends Component {
  state = {
    email: "",
    password: "",
    errorMessage: "",
    loggedIn: false,
    showError: false,
    showNullError: false,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    if (email === "" || password === "") {
      return this.setState({
        showError: false,
        showNullError: true,
        loggedIn: false,
        errorMessage: "Diligencie los Campos!",
      });
    } else {
      try {
        const response = await axios.post("/auth/login", {
          email,
          password,
        });
        localStorage.setItem("JWT", response.data.token);
        localStorage.setItem("USERNAME", response.data.username);
        localStorage.setItem("USERTYPE", response.data.userType);
        localStorage.setItem("USER", response.data.userId);

        if (response.data.userType === "admin") {
          window.location.href = "/auth/admin_profile";
        } else {
          window.location.href = "/auth/profile";
        }

        this.setState({
          loggedIn: true,
          showError: false,
          showNullError: false,
        });
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
            <h1 className="signin-title"> 
               Ingresa con tu Usuario
            </h1>
            <hr />
            <label htmlFor="email"><p>Email</p></label>
            <input
              className="signin-input"
              type="email"
              id="email"
              placeholder="Email" 
              value={this.state.email}
              onChange={this.handleChange}
            />
            <label htmlFor="password"><p>Password</p></label>
            <input
              className="signin-input"
              type="password"
              id="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handleChange}
            />
            <button className="login-btn">Ingresar</button>
            <h4 className="signin-form-err-msg">{this.state.errorMessage}</h4>
          </form>
        </div>
      </div>
    );
  }
}

export default SignIn;