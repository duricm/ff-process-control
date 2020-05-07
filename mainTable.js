import React from 'react';
import './mainTable.css';
import './dropDown.css';

var ffSheet = '';

class Table extends React.Component {
   constructor(props) {
      super(props)

      this.handleDropDownChange = this.handleDropDownChange.bind(this);
      this.handleTextChange = this.handleTextChange.bind(this);
      this.addNewRow = this.addNewRow.bind(this);

      this.state = {
            error : null,
            isLoaded : false,
            columns : [],
	    rows : [],
	    addRow : {},
	    textValues : [],
	    sheet: 'Process Control',
	    rowAddLabel: '',
	    ffDropDown : []
      }
   }

   renderDropDown() {
      return this.state.ffDropDown.map(dd => {
         return <option key={dd}>{dd}</option>
      })
   }


  handleDropDownChange(e) {
    this.state.columns = [];
    this.state.addRow = {};
    this.setState({sheet: e.target.value});
    this.updateColumns(e.target.value);
    this.updateRows(e.target.value);
  }

    updateColumns(sheet){

        fetch("http://localhost:8080/v1/columns/" + sheet + "/")
        .then( response => response.json())
        .then(
            // handle the result
            (result) => {
                this.setState({
                    isLoaded : true,
                    columns : result
                });
            },
            // Handle error
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                })
            }
        )

    }
    updateRows(sheet){

        fetch("http://localhost:8080/v1/rows/" + sheet + "/")
        .then( response => response.json())
        .then(
            // handle the result
            (result) => {
                this.setState({
                    isLoaded : true,
                    rows : result
                });
            },
            // Handle error
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                })
            }
        )
    }

    componentDidMount(){

	this.updateColumns("Process Control");
	this.updateRows("Process Control");

        fetch("http://localhost:8080/v1/sheetname/")
        .then( response => response.json())
        .then(
            // handle the result
            (result) => {
                this.setState({
                    isLoaded : true,
                    ffDropDown : result
                });
            },
            // Handle error
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                })
            }
        )

    }

   renderTableHeader() {

      return this.state.columns.map(column => {
         return <th key={column.key}>{column.name}</th>
      })
   }

   renderAddRow() {

      return this.state.columns.map(column => {
         return <td><input type="text" name={column.name}
	      onChange={event => this.handleTextChange(event)}/></td> 


      })
   }
	
   handleTextChange(event) {

	   var myList = this.state.addRow;
	   myList[event.target.name] = event.target.value;

	   this.setState({ addRow : myList });

   }
   renderTable(){

      return (

	 this.state.rows.map(row => (
         <tr>{row.row.map(cell => (
         <td>{cell}</td>
         ))}
         </tr>
         )
	 ))

   }e

   addNewRow(e){

      var myList = this.state.addRow;
      myList["sheetId"] = this.state.columns[0].key;

      this.setState({ 
	      addRow : myList 
      });
      this.setState({ 
	      isLoaded : false 
      });

      const requestOptions = {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(this.state.addRow)
      }
      fetch("http://localhost:8080/v1/addrow/", requestOptions)
        .then( response => response.json())
        .then(
            // handle the result
            (result) => {
                this.setState({
                    isLoaded : true,
                    rows : result
                });
            },
            // Handle error
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                })
            }
        )
	   /*
        .then( response => { var x = "" })
        .then(
            // handle the result
            (result) => {
                this.setState({
                    isLoaded : true
                });
            }
        )
	*/

      this.setState({
	      rowAddLabel : 'New Row Added'
      });

	   /*
    this.state.columns = [];
    this.state.addRow = {};
    this.setState({sheet: this.state.sheet});
    this.updateColumns(this.state.sheet);
    this.updateRows(this.state.sheet);
    */
   }

   render() {

      const {error, isLoaded, columns} = this.state;
      const sheet = this.state.sheet;

        if(error){
            return <div>Error loading!</div>
        }else if (!isLoaded) {
            return <div>Loading ...</div>
        }else{
      return (
	 <div>
	      <table>
	      <tr>
	      <td>
              <select class="mystyle" value={sheet}
               onChange={this.handleDropDownChange}>{this.renderDropDown()}</select>
	      </td> <td>
	      <h2>Selected sheet: {sheet}</h2>
	      </td></tr>
	      </table>
            <table id='mainsheet'>
               <tbody>
                  <tr>{this.renderTableHeader()}</tr>
                  {this.renderTable()}
                  <tr>{this.renderAddRow()}</tr>
               </tbody>
            </table>

	        <button onClick={this.addNewRow}> Add New Row </button> 
	        <h2>{this.state.rowAddLabel}</h2>

         </div>
      )
	}
   }
}

export default Table;
