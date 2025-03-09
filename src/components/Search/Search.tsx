import React, { useState, useEffect } from 'react';
import styles from './Search.module.css';
import { getSearchTerm, setSearchTerm } from '../../utils/storage';

interface SearchProps {
  onSearchSubmit: (searchTerm: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearchSubmit }) => {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setLocalSearchTerm] = useState<string>('');

  useEffect(() => {
    setLocalSearchTerm(getSearchTerm());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    const trimmedTerm = searchTerm.trim();
    setSearchTerm(trimmedTerm);
    onSearchSubmit(trimmedTerm);
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
