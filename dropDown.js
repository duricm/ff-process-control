import React from 'react';
import './dropDown.css';

class FFDropDown extends React.Component {
   constructor(props) {
      super(props)
      this.handleChange = this.handleChange.bind(this);

      this.state = {
            error : null,
            isLoaded : false,
	    temperature: '',
            ffDropDown : []

      }
   }
   
   handleChange(e) {

	   alert(e.target.value);
       this.props.onTemperatureChange(e.target.value);


   }
   

    componentDidMount(){
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
            },
        )

    }

   renderDropDown() {

      return this.state.ffDropDown.map(dd => {
         return <option key={dd}>{dd}</option>
      })
   }

   setSelectedOption( ddValue ) {

	   alert(ddValue)
	   this.props.handleDD()


   }

   render() {

      const {error, isLoaded, columns} = this.state;

        if(error){
            return <div>Error loading!</div>
        }else if (!isLoaded) {
            return <div>Loading ...</div>
        }else{
      return (
	 <div class="mystyle">
	      <select value={this.props.temperature}
               onChange={this.handleChange}>{this.renderDropDown()}</select>
         </div>
      )
	}
   }
}

export default FFDropDown;
