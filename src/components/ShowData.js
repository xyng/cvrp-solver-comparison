import React from "react"

import Table from './Table'
import Plot from './Plot'

import stringify from 'csv-stringify'
import FileSaver from 'file-saver'

export default class ShowData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    exportToCSV = () => {
        const rows = []

        Object.entries(this.props.data.results).forEach(([instanceName, data]) => {
          Object.entries(data).forEach(([solverName, measurement]) => {
            rows.push([
              instanceName,
              solverName,
              measurement.value,
              measurement.time
            ])
          })
        })

        stringify([
          ['Instance', 'Name', 'Cost', 'Time'],
          ...rows
        ], function(err, output){
          const blob = new Blob([output], {type: "text/csv;charset=utf-8"});
          FileSaver.saveAs(blob, "export.csv");
        })
    }

    updateShow = val => () => {
        this.setState({
            show: val
        });
    }

	render() {
        const rawData = this.props.data;
        const show = this.state.show;

        return (
            <div>
                <div className="btn-group my-3">
                    <button className="btn btn-secondary" onClick={this.updateShow("table")}>Table</button>
                    <button className="btn btn-secondary" onClick={this.updateShow("plot")}>Plot</button>
                </div>
                <div className="mb-3">
                    <button onClick={this.exportToCSV} className="btn btn-primary">Grab CSV</button>
                </div>
                <div>
                    {show === "table" && <Table data={rawData} />}
                    {show === "plot" && <Plot data={rawData} />}
                </div>
            </div>
        )
	}
}