import React, { Component } from 'react';
import axios from 'axios';
import SimpleInput from './SimpleInput';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      things: [],
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  componentDidMount() {
    axios.get('/api')
      .then((response) => {
        this.setState(response.data);
      });
  }
  updateThings(newArray) {
    axios.post('/api', {things: newArray});
  }
  handleAdd(newThing) {
    const newArray = [ ...this.state.things, newThing ];
    this.setState({things: newArray});
    this.updateThings(newArray);
  }
  handleDelete(index) {
    const newArray = this.state.things.filter((item, i) => i !== index);
    this.setState({things: newArray});
    this.updateThings(newArray);
  }
  render() {
    const things = this.state.things.map((thing, i) =>
        <li key={i} onClick={() => this.handleDelete(i)}>{ thing }</li>
    );
    return (
      <div className="App">
        <h1>A list of things:</h1>
        <SimpleInput onAdd={this.handleAdd} />
        <ul>
          {things}
        </ul>
      </div>
    );
  }
}

export default App;
