import React from "react"

export default class SelectAB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (event) => {
    let value = event.target.value;
    if (value.length === 0) {
      value = undefined
    }

    this.setState({
      selected: value
    }, () => {
      this.props.onUpdate(this.state.selected)
    });
  }

  render() {
    const options = this.props.options || []
    const empty = this.props.empty || "Select Option"
    const label = this.props.label || ""
    const name = this.props.name

    return (
      <div className="form-group">
        <label htmlFor={`select-${name}`}>{label}</label>
        <select id={`select-${name}`} className="custom-select" value={this.state.selected} onChange={this.handleChange}>
          <option value="">{empty}</option>
          {options.map(option => (
            <option key={`select-${name}-${option}`} value={option}>{option}</option>
          ))}
        </select>
      </div>
    )
  }
}