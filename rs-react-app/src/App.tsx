import { Component } from 'react';
import Search from './components/Search/Search';
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
        <Search onSearchSubmit={this.handleSearchSubmit} />
      </div>
    );
  }
}

export default App;
