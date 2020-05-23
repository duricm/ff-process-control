import React from 'react';
import './mainTable.css';
import './dropDown.css';

var ffSheet = '';

class Table extends React.Component {
   constructor(props) {
      super(props)

      this.handleDropDownChange = this.handleDropDownChange.bind(this);
      this.handleAddTextChange = this.handleAddTextChange.bind(this);
      this.handleNewSheetNameTextChange = this.handleNewSheetNameTextChange.bind(this);
      this.handleEditTextChange = this.handleEditTextChange.bind(this);
      this.addNewRow = this.addNewRow.bind(this);
      this.createNewSheet = this.createNewSheet.bind(this);
      this.handleDeleteRow = this.handleDeleteRow.bind(this);
      this.handleEditRow = this.handleEditRow.bind(this);

      this.state = {
            error : null,
            isLoaded : false,
            columns : [],
	    rows : [],
	    addRow : {},
	    editRow : {},
	    textValues : [],
	    sheet: 'Process Control',
	    rowAddLabel: '',
	    createSheetName: 'Test New Sheet 22',
	    editButtonText: 'Edit',
	    editingRow: -1,
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
    this.state.editRow = {};
    this.setState({
	    editButtonText : 'Edit'
    });
    this.setState({
	    editingRow : -1
     });
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
	      onChange={event => this.handleAddTextChange(event)}/></td> 


      })
   }
	
   handleEditTextChange(event) {
	   var myList = this.state.editRow;
	   myList[event.target.name] = event.target.value;
	   this.setState({ editRow : myList });
   }

   handleAddTextChange(event) {

	   var myList = this.state.addRow;
	   myList[event.target.name] = event.target.value;
	   this.setState({ addRow : myList });
   }

   handleNewSheetNameTextChange(event) {

	   this.setState({ createSheetName : event.target.value });
   }

   renderTable(){

      return (

	 this.state.rows.map(row => (
         <tr> <td>

         <table border="0"><tr><td><button name={row.rowNumber} 
		 onClick={this.handleEditRow}>{this.state.editButtonText}</button></td><td>

          <button name={row.rowNumber} 
		 onClick={(key, e) => {if(window.confirm("Are you sure you want to delete the row?"))
			 {this.handleDeleteRow(key, e)};}}>Delete</button></td></tr></table>

         </td>
	 {row.row.map((cell, index) => (
         <td>{ row.rowNumber == this.state.editingRow ? <input name={index} 
		 onChange={event => this.handleEditTextChange(event)} 
		 defaultValue={cell} /> :  cell  }</td>
         ))}
         </tr>
         )
	 ))

   }

   handleEditRow(e){

   if (this.state.editButtonText == 'Edit')
   {
      this.setState({ editButtonText : 'Update' });
      this.setState({ editRow : {} });
   }

   this.setState({
	   editingRow : e.target.name
   });


   if (this.state.editButtonText == 'Update')
   {
      var myList = this.state.editRow;
      myList["sheetId"] = this.state.columns[0].key;
      myList["rowNumber"] = e.target.name;

      this.setState({ 
	      editRow : myList 
      });
      this.setState({ 
	      isLoaded : false 
      });

      const requestOptions = {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(this.state.editRow)
      }
      fetch("http://localhost:8080/v1/updaterow/", requestOptions)
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
	      rowAddLabel : 'Row Updated'
      });
      this.setState({ editButtonText : 'Edit' });
      this.setState({ editingRow: -1 });
   }
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

   createNewSheet(e){

      var sheetName = this.state.createSheetName;

      this.setState({ 
	      isLoaded : false 
      });

      const requestOptions = {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: this.state.createSheetName
      }
      fetch("http://localhost:8080/v1/createsheet/", requestOptions)
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

      this.setState({
	      rowAddLabel : 'New Sheet Created'
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
	      </td>
	      <td></td><td></td>
              <td> <button class="button" onClick={this.createNewSheet}>Create New Sheet</button></td>
              <td><input type="text" name="newSheetName" placeholder="Enter sheet name"
	      onChange={event => this.handleNewSheetNameTextChange(event)}/></td> 
	      <td>

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
