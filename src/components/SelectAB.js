import React from "react"

export default class SelectAB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChangeA = (event) => {
    let value = event.target.value;
    if (value.length === 0) {
      value = undefined
    }

    this.setState({
      compareA: value
    }, () => {
      this.props.onUpdate(this.state.compareA, this.state.compareB)
    });
  }

  handleChangeB = (event) => {
    let value = event.target.value;
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
        <div className="form-group col-6">
          <label htmlFor="compareASelect">Compare A:</label>
          <select id="compareASelect" className="custom-select" value={this.state.compareA} onChange={this.handleChangeA}>
            <option value="">Select Solver to compare</option>
            {solvers.filter(solver => solver !== this.state.compareB).map(solver => (
              <option key={'compareASelect-' + solver} value={solver}>{solver}</option>
            ))}
          </select>
        </div>
        <div className="form-group col-6">
          <label htmlFor="compareBSelect">Compare B:</label>
          <select id="compareBSelect" className="custom-select" value={this.state.compareB} onChange={this.handleChangeB}>
            <option value="">Select Solver to compare</option>
            {solvers.filter(solver => solver !== this.state.compareA).map(solver => (
              <option key={'compareBSelect-' + solver} value={solver}>{solver}</option>
            ))}
          </select>
        </div>
       </div>
    )
  }
}