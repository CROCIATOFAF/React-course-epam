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
        <video className="video-background" autoPlay loop muted>
          <source src="/earth.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h1>Discover</h1>
        <div className="app__text-container">
          <span>our intergalactic multimedia collections</span>
          <p className="app__text-container-important">
            Enter: &apos;simulate404&apos; or &apos;simulate500&apos; to see
            error messages, as NASA API will send back 200 regardless
          </p>
        </div>
        <Home />
      </div>
    );
  }
}

export default App;
