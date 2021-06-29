import React, { Component } from 'react';
import DexList from '../components/DexList/DexList';
import Search from '../components/Search/Search';
import './App.css';

class App extends Component {
  constructor() {
		super()
		this.state = {
			dex: []
		}
	}

  updateDex = (data) => {
    this.setState({ dex: data });
  }

  componentDidMount() {
		fetch('http://localhost:3001/pokedex').then(response => {
			return response.json();
		})
		.then(pokemon => {
			this.setState({ dex: pokemon });
		});
	}

  render() {
    return (
      <div className="container">
        <h1>React Dex</h1>
        <Search updateDex={this.updateDex} />
        <div className="dex-list-container">
          <DexList dex={this.state.dex} />
        </div>
      </div>
    );
  }
}

export default App;
