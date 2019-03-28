import React from "react"

import Select from "./Select"
import Plot from 'react-plotly.js';

export default class ShowData extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            depot: {
                x: 0,
                y: 0
            }
        }
    }

    changeInstance = (instance) => {
        this.setState({
            instance
        })
    }

    changeSolver = (solver) => {
        this.setState({
            solver
        })
    }

    updateDepotX = (event) => {
        let value = event.target.value;
        if (value.length === 0) {
          value = undefined
        }

        this.setState({
            depot: {
                ...this.state.depot,
                x: parseInt(value, 10)
            }
        });
    }

    updateDepotY = (event) => {
        let value = event.target.value;
        if (value.length === 0) {
          value = undefined
        }

        this.setState({
            depot: {
                ...this.state.depot,
                y: parseInt(value, 10)
            }
        });
    }

    render() {
        const { results, solvers } = this.props.data
        const { instance, solver, depot } = this.state

        const instances = Object.keys(results);

        let data = [];

        if (instance && solver) {
            let route = 1;
            data = results[instance][solver].solution.map(route => ({
                x: [
                    depot.x,
                    ...route.map(demand => demand.node.x),
                    depot.x,
                ],
                y: [
                    depot.y,
                    ...route.map(demand => demand.node.y),
                    depot.y,
                ],
                type: 'scatter',
                mode: 'lines+markers',
                label: `Route ${route}`
            }))
        }

        return (
            <div>
                <Select
                    options={instances}
                    label="Instance:"
                    empty="Select Instance to plot"
                    name="instance"
                    onUpdate={this.changeInstance}
                />
                {
                    instance &&
                    <div>
                        <Select
                            options={solvers}
                            label="Solver:"
                            empty="Select Solver to plot"
                            name="solver"
                            onUpdate={this.changeSolver}
                        />
                        <div className="row">
                            <div className="form-group col-6">
                                <label htmlFor="depotx">Depot X:</label>
                                <input type="number" id="depotx" className="form-control" onChange={this.updateDepotX} placeholder="Depot X" value={depot.x} />
                            </div>
                            <div className="form-group col-6">
                                <label htmlFor="depoty">Depot Y:</label>
                                <input type="number" id="depoty" className="form-control" onChange={this.updateDepotY} placeholder="Depot Y" value={depot.y} />
                            </div>
                        </div>
                    </div>
                }
                {
                    instance && solver &&
                    <div>
                        <p>Total Cost: {results[instance][solver].value}</p>
                        <p>Time: Total Cost: {results[instance][solver].time}</p>
                        <Plot
                            data={data}
                            layout={ {width: 1280, height: 1280, title: `${instance} - ${solver}`} }
                        />
                    </div>
                }
            </div>
        )
    }
}