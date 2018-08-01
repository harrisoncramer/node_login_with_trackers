import React from "react";
import ReactDOM from "react-dom";
import "./styles/styles.scss";
import axios from "axios";
import registerServiceWorker from './registerServiceWorker';

class Login extends React.Component {

  login(e) {
    e.preventDefault();
    var email = e.target.elements.email.value;
    var password = e.target.elements.password.value;
    axios.post("/users/login", {
      email: email,
      password: password
    })
    .then((res) => {
      console.log(res.data)
    })
    .catch((e) => {
    });
  }

  render(){
    return (
      <div>
        <form onSubmit={this.login}>
          <legend>Login</legend>
          <label>Email:</label>
          <input type='text' name='email'/>
          <label>Password:</label>
          <input type='text' name='password'/>
          <button>Login</button>
        </form>
        <button onClick={this.emailPassword}>Forgot Password?</button>
      </div>
    );
  }
}

ReactDOM.render(<Login />, document.getElementById("app"));
registerServiceWorker();
