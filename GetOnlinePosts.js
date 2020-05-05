import React, { Component , useState } from "react";
import ReactDOM from "react-dom";
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data } from "react-data-grid-addons";
import createRowData from "./createRowData";
//import createColumnData from "./createColumnData";

import "./styles.css";

const defaultColumnProperties = {
  filterable: true,
  sortable: true,
  width: 120
};

const initialRows = createRowData(50);
//const [filters, setFilters] = useState({});
//const filteredRows = getRows(initialRows, filters);
//const [rows, setRows] = useState(initialRows);


const selectors = Data.Selectors;
var sortClicked = false;

var columns = [
  { key: "id", name: "ID" },
  { key: "title", name: "Title" },
  { key: "firstName", name: "First Name" },
  { key: "lastName", name: "Last Name" },
  { key: "email", name: "Email" },
  { key: "street", name: "Street" },
  { key: "zipCode", name: "ZipCode" },
  { key: "date", name: "Date" },
  { key: "jobTitle", name: "Job Title" },
  { key: "catchPhrase", name: "Catch Phrase" },
  { key: "jobArea", name: "Job Area" },
  { key: "jobType", name: "Job Type" }
].map(c => ({ ...c, ...defaultColumnProperties }));


const sortRows = (initialRows) => rows => {
	var sortColumn;
	var sortDirection;
  sortClicked = true;
	alert('sorting');
  const comparer = (a, b) => {
    if (sortDirection === "ASC") {
      return a[sortColumn] > b[sortColumn] ? 1 : -1;
    } else if (sortDirection === "DESC") {
      return a[sortColumn] < b[sortColumn] ? 1 : -1;
    }
  };
  return sortDirection === "NONE" ? rows : [...rows].sort(comparer);
};

const handleFilterChange = filter => filters => {
   sortClicked = false;
   const newFilters = { ...filters };
  if (filter.filterTerm) {
    newFilters[filter.column.key] = filter;
  } else {
    delete newFilters[filter.column.key];
  }
  return newFilters;
};

function getRows(rows, filters) {
  return selectors.getRows({ rows, filters });
}


// get posts from online api
// it's return a json file
class GetOnlinePosts extends Component {
    constructor(props){
        super(props);
        this.state = {
            error : null,
            isLoaded : false,
            rows : initialRows,
            posts : []          
        };
    }

    componentDidMount(){

        fetch("http://localhost:8080/v1/test5")
        .then( response => response.json())
        .then(
            // handle the result
            (result) => {
                this.setState({
                    isLoaded : true,
                    posts : result
                });
            },

            // Handle error 
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                })
            },
        )
    }

    render() { 
  //const [filters, setFilters] = useState({});
  //const filteredRows = getRows(initialRows, filters);
  //const [rows, setRows] = useState(initialRows);

   //var selectedRows = filteredRows;

   //if (sortClicked)
    //    selectedRows = rows;

	const {error, isLoaded, rows} = this.state;

        if(error){
            return <div>Error in loading</div>
        }else if (!isLoaded) {
            return <div>Loading ...</div>
        }else{
            return(
      <ReactDataGrid
      columns={columns}
      rowGetter={i => this.state.rows[i]}
      rowsCount={this.state.rows.length}
      minHeight={650}
      toolbar={<Toolbar enableFilter={true} />}
      //onAddFilter={filter => setFilters(handleFilterChange(filter))}
      //onClearFilters={() => setFilters({})}
      onGridSort={sortRows(initialRows) 
      }
    />

            );
		
        }


    }
  }
  
  export default GetOnlinePosts;
