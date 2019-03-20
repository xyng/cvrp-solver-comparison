import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Dropzone from './components/Dropzone';
import Table from './components/Table';

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
        <main>
           <Dropzone callback={this.gotData} />
           {this.state.data && <Table data={this.state.data} />}
        </main>
      </div>
    );
  }
}

export default App;
