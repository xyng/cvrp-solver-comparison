import React from "react"

import Select from "./Select"

export default class SelectAB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChangeA = (value) => {
    if (value.length === 0) {
      value = undefined
    }

    this.setState({
      compareA: value
    }, () => {
      this.props.onUpdate(this.state.compareA, this.state.compareB)
    });
  }

  handleChangeB = (value) => {
    if (value.length === 0) {
      value = undefined
    }

    this.setState({
      compareB: value
    }, () => {
      this.props.onUpdate(this.state.compareA, this.state.compareB)
    });
  }

  render() {
    const solvers = this.props.solvers || []

    return (
      <div className="row mb-4">
        <div className="col-6">
          <Select
            options={solvers.filter(solver => solver !== this.state.compareB)}
            label="Compare A:"
            empty="Select Solver to compare"
            name="compareA"
            onUpdate={this.handleChangeA}
          />
        </div>
        <div className="col-6">
          <Select
            options={solvers.filter(solver => solver !== this.state.compareA)}
            label="Compare B:"
            empty="Select Solver to compare"
            name="compareB"
            onUpdate={this.handleChangeB}
          />
        </div>
       </div>
    )
  }
}