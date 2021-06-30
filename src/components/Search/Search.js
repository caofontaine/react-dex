import React, { Component } from 'react';
import './Search.css';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchBoxText: ''
    }
  }

  onSearchBoxChange = (event) => {
		this.setState({searchBoxText: event.target.value});
	}

  onSubmitSearch = () => {
    fetch('https://guarded-plains-41562.herokuapp.com/searchdex', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
				searchName: this.state.searchBoxText
			})
    })
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data)) this.props.updateDex(data);
    })
  }

  render() {
    return (
      <div className="search">
        <input onChange={this.onSearchBoxChange} className="search-text" type="text" name="pokemon-search"  id="pokemon-search" />
        <input onClick={this.onSubmitSearch} className="search-button" type="submit" value="Search" />
      </div>
    );
  }
}

export default Search;
