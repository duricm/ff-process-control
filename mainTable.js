import React from 'react';
import './mainTable.css';
import './dropDown.css';

var ffSheet = '';

class Table extends React.Component {
   constructor(props) {
      super(props)

      this.handleChange = this.handleChange.bind(this);

      this.state = {
         students: [
            { id: 1, name: 'Wasif', age: 21, email: 'wasif@email.com' },
            { id: 2, name: 'Ali', age: 19, email: 'ali@email.com' },
            { id: 3, name: 'Saad', age: 16, email: 'saad@email.com' },
            { id: 4, name: 'Asad', age: 25, email: 'asad@email.com' }
         ],
            error : null,
            isLoaded : false,
            columns : [],
	    rows : [],
	    sheet: '',
	    ffDropDown : []

      }
   }

   renderDropDown() {
      return this.state.ffDropDown.map(dd => {
         return <option key={dd}>{dd}</option>
      })
   }


  handleChange(e) {
    this.state.columns = [];
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

   renderTable(){

      return (

	 this.state.rows.map(row => (
         <tr>{row.row.map(cell => (
         <td>{cell}</td>
         ))}
         </tr>
         ))


      )
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
               onChange={this.handleChange}>{this.renderDropDown()}</select>
	      </td> <td>
	      <h2>Selected sheet: {sheet}</h2>
	      </td></tr>
	      </table>
            <table id='mainsheet'>
               <tbody>
                  <tr>{this.renderTableHeader()}</tr>
                  {this.renderTable()}
         <tr>
	          <td><input type="text" name="name" /></td>
	          <td><input type="text" name="name" /></td>
	          <td><input type="text" name="name" /></td>
	          <td><input type="text" name="name" /></td>
         </tr>
               </tbody>
            </table>
         </div>
      )
	}
   }
}

export default Table;
