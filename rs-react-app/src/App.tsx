import { Component } from 'react';
import Home from './pages/Home';

import './App.css';

class App extends Component {
  state = { searchTerm: '' };

  handleSearchSubmit = (searchTerm: string) => {
    this.setState({ searchTerm });
  };

  render() {
    return (
      <div className="app-container">
        <h1>Discover</h1>
        <span>our intergalactic multimedia collections</span>
        <Home />
      </div>
    );
  }
}

export default App;
