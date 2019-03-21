import React  from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

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
  render() {
    const rawData = this.props.data;

    const data = Object.entries(rawData).map(([key, value]) => {
      value.instance = key;

      return value;
    });

    console.log(data);

    const columns = [{
      Header: 'Instance',
      accessor: 'instance' // String-based value accessors!
    }, {
      Header: 'BA',
      columns: [{
        Header: 'Cost',
        accessor: 'BA.value',
        Cell: props => <span className='number'>{props.value.toFixed(2)}</span>
      }, {
        Header: 'Time',
        accessor: 'BA.time',
        Cell: props => <span className='number'>{nsToTime(props.value)}</span>
      }]
    }, {
      Header: 'FBA',
      columns: [{
        Header: 'Cost',
        accessor: 'FBA.value',
        Cell: props => <span className='number'>{props.value.toFixed(2)}</span>
      }, {
        Header: 'Time',
        accessor: 'FBA.time',
        Cell: props => <span className='number'>{nsToTime(props.value)}</span>
      }]
    }, {
      Header: 'BA - FBA',
      columns: [{
        Header: 'Cost',
        id: 'value-ba-fba',
        accessor: d => d.BA.value - d.FBA.value,
        Cell: props => <span className='number'>{props.value.toFixed(2)}</span>
      }, {
        Header: '%',
        id: 'value-percent-ba-fba',
        accessor: d => ((d.BA.value / d.FBA.value) * 100),
        Cell: props => <span className='number'>{props.value.toFixed(2)} %</span>
      }, {
        Header: 'Time',
        id: 'time-ba-fba',
        accessor: d => d.BA.time - d.FBA.time,
        Cell: props => <span className='number'>{nsToTime(props.value)}</span>
      }, {
        Header: '%',
        id: 'time-percent-ba-fba',
        accessor: d => ((d.BA.time / d.FBA.time) * 100),
        Cell: props => <span className='number'>{props.value.toFixed(2)} %</span>
      }]
    }]

    return (
      <div>
        <p className="lead my-3">Showing Results of {data.length} Instances</p>
        <ReactTable
          data={data}
          columns={columns}
        />
      </div>
    );
  }
}