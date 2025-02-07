import React, { useState, useEffect, useCallback } from 'react';
import styles from './Home.module.css';
import Search from '../components/Search/Search';
import CardList from '../components/CardList/CardList';
import { fetchNasaImages, CardData } from '../components/services/nasaApi';
import { getSearchTerm, setSearchTerm } from '../utils/storage';
import Spinner from '../components/Spinner/Spinner';

interface ApiError extends Error {
  code?: number;
}
interface HomeProps {
  onSearchSubmit: (term: string) => void;
}

const Home: React.FC<HomeProps> = ({ onSearchSubmit }) => {
  const [items, setItems] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setLocalSearchTerm] = useState<string>(getSearchTerm());
  const [forceError, setForceError] = useState<boolean>(false);

  const fetchData = useCallback((term: string) => {
    setLoading(true);
    setError(null);
    fetchNasaImages(term)
      .then((fetchedItems) => {
        setItems(fetchedItems);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error('[Home] Error fetching data:', err);
        let errorMessage = '';
        if (err instanceof Error) {
          const apiError = err as ApiError;
          errorMessage = apiError.code
            ? `${apiError.message} (Code: ${apiError.code})`
            : apiError.message;
        } else {
          errorMessage = 'An unexpected error occurred.';
        }
        setError(errorMessage);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const term = searchTerm.trim();
    fetchData(term);
  }, [fetchData, searchTerm]);

  const handleSearchSubmit = (term: string) => {
    setSearchTerm(term); // Save to local storage
    setLocalSearchTerm(term);
    onSearchSubmit(term);
    fetchData(term);
  };

  const handleThrowError = () => {
    setForceError(true);
  };

  if (forceError) {
    throw new Error('This is a forced render error!');
  }

  return (
    <div className={styles.homeContainer}>
      <Search onSearchSubmit={handleSearchSubmit} />
      {loading && <Spinner />}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className={styles.errorMessage}>Error: {error}</div>
      ) : (
        <CardList items={items} />
      )}
      <button onClick={handleThrowError} className={styles.errorButton}>
        Throw Error
      </button>
    </div>
  );
};

export default Home;
