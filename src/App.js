import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import "bootstrap/dist/css/bootstrap.css";

import Dropzone from './components/Dropzone';
import ShowData from './components/ShowData';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  gotData = (data) => {
    this.setState({
      data
    })
  }

  render() {
    return (
      <div className="App">
        <main className="container-fluid">
          <div className="mt-4">
            <Dropzone callback={this.gotData} />
          </div>
          {this.state.data && <ShowData data={this.state.data} />}
        </main>
      </div>
    );
  }
}

export default App;
