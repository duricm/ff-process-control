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
      this.handleDeleteRow = this.handleDeleteRow.bind(this);

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
      this.setState({
	      rowAddLabel : ''
      });
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
         <tr> <td>
         <table border="0"><tr><td><button onClick={this.addNewRow}>Edit</button></td><td>
          <button name={row.rowNumber} onClick={(key, e) => {if(window.confirm("Are you sure you want to delete the row?")){this.handleDeleteRow(key, e)};}}>Delete</button></td></tr></table>

         </td>
	 {row.row.map(cell => (
         <td>{cell}</td>
         ))}
         </tr>
         )
	 ))

   }

   handleDeleteRow(e){

      var sheetId = this.state.columns[0].key;
      var rowNumber = e.target.name;

      this.setState({ 
	      isLoaded : false 
      });

      const requestOptions = {
         method: 'DELETE',
         headers: { 'Content-Type': 'application/json' }
      }
     
      fetch("http://localhost:8080/v1/deleterow/" + sheetId + "/" + rowNumber, requestOptions)
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

      this.setState({
	      rowAddLabel : 'Row Deleted'
      });

   }

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

      this.setState({
	      rowAddLabel : 'New Row Added'
      });

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
                  <tr><th width="20px">Action</th>{this.renderTableHeader()}</tr>
                  {this.renderTable()}
                  <tr><td> <button onClick={this.addNewRow}> Add New Row </button></td>
	          {this.renderAddRow()}</tr>
               </tbody>
            </table>
	        <h2>{this.state.rowAddLabel}</h2>
         </div>
      )
	}
   }
}

export default Table;
