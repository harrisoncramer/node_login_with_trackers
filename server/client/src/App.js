import React, { Component } from 'react';
import "./styles/normalize.css";
import "./styles/styles.scss";
import { ForgotPassword, Login } from "./components/components.js";

class App extends Component {
  render() {
      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Court Tracker</h1>
            <ForgotPassword />
            <Login />
          </header>
        </div>
    );
  }
};

export default App;
