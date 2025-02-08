// Home.tsx
import React, { useState, useEffect, useCallback } from 'react';
import styles from './Home.module.css';
import Search from '../components/Search/Search';
import CardList from '../components/CardList/CardList';
import { fetchNasaImages, CardData } from '../components/services/nasaApi';
import { getSearchTerm, setSearchTerm } from '../utils/storage';
import Spinner from '../components/Spinner/Spinner';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../components/Pagination/Pagination';

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

  // Use React Router’s search params to read/update the current page in the URL
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

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
    // Fetch data using the current search term on mount or when it changes
    const term = searchTerm.trim();
    fetchData(term);
  }, [fetchData, searchTerm]);

  const handleSearchSubmit = (term: string) => {
    setSearchTerm(term); // Save to local storage
    setLocalSearchTerm(term);
    onSearchSubmit(term);
    // Reset pagination to the first page on new search
    setCurrentPage(1);
    setSearchParams({ page: '1' });
    fetchData(term);
  };

  const handleThrowError = () => {
    setForceError(true);
  };

  if (forceError) {
    throw new Error('This is a forced render error!');
  }

  // --- Pagination Logic ---
  const itemsPerPage = 10;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Update the URL query parameter with the new page
    setSearchParams({ page: page.toString() });
  };

  return (
    <div className={styles.homeContainer}>
      <Search onSearchSubmit={handleSearchSubmit} />
      {loading && <Spinner />}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className={styles.errorMessage}>Error: {error}</div>
      ) : items.length > 0 ? (
        <>
          {/* Render only the items for the current page */}
          <CardList items={currentItems} />
          {/* Show the pagination component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div>No results found.</div>
      )}
      <button onClick={handleThrowError} className={styles.errorButton}>
        Throw Error
      </button>
    </div>
  );
};

export default Home;
