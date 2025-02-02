import { Component } from 'react';
import styles from './Search.module.css';
import { getSearchTerm, setSearchTerm } from '../../utils/storage';

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
      searchTerm: getSearchTerm(),
    };
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    console.log('[Search] Input changed to:', value);
    this.setState({ searchTerm: value });
  };

  // Trim whitespace and trigger the search.
  handleSearch = () => {
    const trimmedTerm = this.state.searchTerm.trim();
    console.log('[Search] Search triggered with term:', trimmedTerm);

    setSearchTerm(trimmedTerm);
    this.props.onSearchSubmit(trimmedTerm);
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
          onKeyDown={this.handleKeydown}
          placeholder='Search for ... (e.g. "Orion")'
        />
        <button
          onClick={this.handleSearch}
          disabled={!this.state.searchTerm.trim()}
          className={styles['search-button']}
        >
          Search
        </button>
      </div>
    );
  }
}

export default Search;
