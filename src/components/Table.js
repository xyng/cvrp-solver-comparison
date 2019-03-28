import React  from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import SelectAB from './SelectAB'

import stringify from 'csv-stringify'
import FileSaver from 'file-saver'

// Pad to 2 or 3 digits, default is 2
function pad(n, z) {
  z = z || 2;
  return ('00' + n).slice(-z);
}

function nsToTime(s) {
  const negative = s < 0;
  s = Math.abs(s);

  var ns = s % 1000;
  s = (s - ns) / 1000;
  var mics = s % 1000;
  s = (s - mics) / 1000;
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var m = s % 60;

  return (negative ? '- ' : '') + pad(m, 2) + ':' + pad(secs, 2) + ':' + pad(ms, 3);
}

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  updateAB = (compareA, compareB) => {
    this.setState({
      compareA, compareB
    }, () => {
      this.setState(Table.updateColumns(this.props, this.state))
    })
  }

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      ...Table.updateColumns(props, state)
    }
  }

  exportToCSV = () => {
        const rows = {}
        const headers = []

        const rawData = this.props.data;
        const data = Object.entries(rawData.results).map(([key, value]) => {
          const newVal = Object.assign({}, value)
          newVal.instance = key;

          return newVal;
        });

        this.state.columns.forEach(elem => {
          if (elem.columns) {
            elem.columns.forEach(column => {
              data.forEach(value => {
                rows[value.instance] = [
                  ...(rows[value.instance] || []),
                  column.accessor(value)
                ]
              })
              headers.push(`${elem.Header} - ${column.Header}`)
            })
          } else {
            headers.push(elem.Header)

            data.forEach(value => {
              rows[value.instance] = [
                ...(rows[value.instance] || []),
                elem.accessor(value)
              ]
            })
          }
        })

        stringify([
          headers,
          ...(Object.values(rows))
        ], function(err, output){
          const blob = new Blob([output], {type: "text/csv;charset=utf-8"});
          FileSaver.saveAs(blob, "export.csv");
        })
    }

  static updateColumns(props, state) {
    const rawData = props.data;

    const { compareA, compareB } = state;

    const solverColumns = rawData.solvers.filter(elem => {
      return (!compareA || !compareB) || (elem === compareA || elem === compareB)
    }).map((elem) => ({
      Header: elem,
      columns: [{
        Header: 'Cost',
        id: `${elem}-value`,
        accessor: d => d[elem].value,
        Cell: props => <span className='number'>{(props.value || Infinity).toFixed(2)}</span>
      }, {
        Header: 'Time',
        id: `${elem}-time`,
        accessor: d => d[elem].time,
        Cell: props => <span className='number'>{nsToTime(props.value)}</span>
      }]
    }));

    const compareColumns = [];
    if (compareA && compareB) {
      compareColumns.push({
        Header: `${compareA} - ${compareB}`,
        columns: [{
          Header: 'Cost',
          id: 'value-compare',
          accessor: d => d[compareA].value - d[compareB].value,
          Cell: props => <span className='number'>{props.value.toFixed(2)}</span>
        }, {
          Header: '%',
          id: 'value-percent-compare',
          accessor: d => ((d[compareA].value / d[compareB].value) * 100),
          Cell: props => <span className='number'>{props.value.toFixed(2)} %</span>
        }, {
          Header: 'Time',
          id: 'time-compare',
          accessor: d => d[compareA].time - d[compareB].time,
          Cell: props => <span className='number'>{nsToTime(props.value)}</span>
        }, {
          Header: '%',
          id: 'time-percent-compare',
          accessor: d => ((d[compareA].time / d[compareB].time) * 100),
          Cell: props => <span className='number'>{props.value.toFixed(2)} %</span>
        }]
      })
    }

    const columns = [
      {
        Header: 'Instance',
        id: 'instance',
        accessor: d => d.instance
      },
      ...solverColumns,
      ...compareColumns
    ];

    return {
      columns
    }
  }

  render() {
    const { columns, compareA, compareB } = this.state
    const rawData = this.props.data

    const data = Object.entries(rawData.results).map(([key, value]) => {
      const newVal = Object.assign({}, value)
      newVal.instance = key;

      return newVal;
    });

    return (
      <div>
        <p className="lead my-3">Showing Results of {data.length} Instances</p>
        <button className="btn btn-primary" onClick={this.exportToCSV}>CSV</button>
        <SelectAB solvers={rawData.solvers} onUpdate={this.updateAB} />
        <ReactTable
          data={data}
          columns={columns}
        />
      </div>
    );
  }
}