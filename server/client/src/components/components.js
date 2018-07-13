import React, { Component } from 'react';
import { apiPOST, apiGET, apiDELETE } from './apiCalls'

import { HomePage } from "./HomePage.js";
// import displayUser function.

export class Login extends Component {
  constructor(props) {
    super(props);
    this.logUserIn = this.logUserIn.bind(this);
  }
  state = {
    email: "email",
    password: "password"
  };

  logUserIn(e){
    e.preventDefault();
    var login = { email: document.getElementById("email").value, password: document.getElementById("password").value };
    apiPOST("/users/login",login)
      .then((express) => {
       const { data } = express
       console.log(data);
        /// Display ///
       HomePage(data);
      })
      .catch(err => {
        alert(err);
      });
  };

  render() {
    return (
      <div>
        <form>
          <input type="text" name="email" id="email" defaultValue={this.state.email} />
          <input type="text" name="password" id="password" defaultValue={this.state.password} />
          <input type="submit" onClick={this.logUserIn}/>
        </form>
      </div>
    );
  }
}

export class ForgotPassword extends Component {
  render(){
    return (
      <div>
        <button>Forgot password?</button>
      </div>
    )
  }
}