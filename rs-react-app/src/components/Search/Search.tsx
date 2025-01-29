import React, { Component } from 'react';
import styles from './Search.module.css';

interface SearchProps {
  onSearchSubmit: (searchTerm: string) => void;
}

interface SearchState {
  searchTerm: string;
}

class Search extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.state = {
      searchTerm: localStorage.getItem('searchTerm') || '',
    };
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  // trims whitespace
  handleSearch = () => {
    const trimmedTerm = this.state.searchTerm.trim();
    if (trimmedTerm) {
      localStorage.setItem('searchTerm', trimmedTerm);
      this.props.onSearchSubmit(trimmedTerm);
    }
  };

  handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  };

  render() {
    return (
      <div className={styles['search-container']}>
        <input
          type="text"
          value={this.state.searchTerm}
          onChange={this.handleChange}
          placeholder='Search for ... (e.g. "Orion")'
        />
        <button
          onClick={this.handleSearch}
          disabled={!this.state.searchTerm.trim()}
        >
          Search
        </button>
      </div>
    );
  }
}

export default Search;
