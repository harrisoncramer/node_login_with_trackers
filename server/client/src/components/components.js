import React, { Component } from 'react';
import axios from 'axios';

const callApi = async(url, params) => {
  return axios.post(url,params)
  .then((response) => {
    return Promise.resolve(response);
  })
  .catch((err) => {
    return Promise.reject(err);
  });
};

export class Login extends Component {
  constructor(props) {
    super(props);
    this.logUserIn = this.logUserIn.bind(this);
  }
  state = {
    email: "test",
    password: "tester"
  };

  logUserIn(e){
    e.preventDefault();
    var login = { email: document.getElementById("email").value, password: document.getElementById("password").value };
    callApi("/users/login",login)
      .then((res) => {
        console.log(res.data)
        // Update the application here!
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
        <h2>Login</h2>
        <button>Forgot password?</button>
      </div>
    )
  }
}