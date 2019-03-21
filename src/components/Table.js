import React  from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import SelectAB from './SelectAB'

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
  var s = s % 60;
  s = (s - s) / 60;
  var m = s % 60;

  return (negative ? '- ' : '') + pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 3);
}

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  updateAB = (compareA, compareB) => {
    this.setState({
      compareA, compareB
    })
  }

  render() {
    const rawData = this.props.data;

    const data = Object.entries(rawData.results).map(([key, value]) => {
      value.instance = key;

      return value;
    });

    const solverColumns = [];

    rawData.solvers.forEach((elem) => {
      solverColumns.push({
        Header: elem,
        columns: [{
          Header: 'Cost',
          accessor: elem + '.value',
          Cell: props => <span className='number'>{props.value.toFixed(2)}</span>
        }, {
          Header: elem,
          accessor: elem + '.time',
          Cell: props => <span className='number'>{nsToTime(props.value)}</span>
        }]
      })
    });

    const compareColumns = [];
    const { compareA, compareB } = this.state;
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
        accessor: 'instance'
      },
      ...solverColumns,
      ...compareColumns
    ];

    return (
      <div>
        <p className="lead my-3">Showing Results of {data.length} Instances</p>
        <SelectAB solvers={rawData.solvers} onUpdate={this.updateAB} />
        <ReactTable
          data={data}
          columns={columns}
        />
      </div>
    );
  }
}