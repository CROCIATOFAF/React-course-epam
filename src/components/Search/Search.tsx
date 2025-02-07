import React, { useState } from 'react';
import styles from './Search.module.css';
import { getSearchTerm, setSearchTerm } from '../../utils/storage';

interface SearchProps {
  onSearchSubmit: (searchTerm: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearchSubmit }) => {
  const [searchTerm, setLocalSearchTerm] = useState<string>(getSearchTerm());

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(event.target.value);
  };

  // Trim whitespace and trigger the search.
  const handleSearch = () => {
    const trimnedTerm = searchTerm.trim();
    setSearchTerm(trimnedTerm);
    onSearchSubmit(trimnedTerm);
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles['search-container']}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeydown}
        placeholder='Search for ... (e.g. "Orion")'
      />
      <button
        onClick={handleSearch}
        disabled={!searchTerm.trim()}
        className={styles['search-button']}
      >
        Search
      </button>
    </div>
  );
};

export default Search;
