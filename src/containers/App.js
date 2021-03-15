import React, { Component } from 'react';
import DexList from '../components/DexList/DexList';
//import { dex } from '../dex';
import './App.css';

/*function App() {
  return (
    <div className="container">
      <DexList dex={dex} />
    </div>
  );
}*/

class App extends Component {
  constructor() {
		super()
		this.state = {
			dex: []
		}
	}

  componentDidMount() {
		fetch('http://localhost:3001/pokedex').then(response => {
			return response.json();
		})
		.then(pokemon => {
      console.log(pokemon);
			this.setState({ dex: pokemon });
      console.log(this.state.dex);
		});
	}

  render() {
    return (
      <div className="container">
        <DexList dex={this.state.dex} />
      </div>
    );
  }
}

export default App;
