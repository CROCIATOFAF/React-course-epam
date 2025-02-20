import React, { useState, useEffect, useCallback } from 'react';
import styles from './Home.module.css';
import Search from '../components/Search/Search';
import CardList from '../components/CardList/CardList';
import { fetchNasaImages, CardData } from '../components/services/nasaApi';
import { getSearchTerm, setSearchTerm } from '../utils/storage';
import Spinner from '../components/Spinner/Spinner';
import Pagination from '../components/Pagination/Pagination';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, selectItem, unselectItem } from '../store';
import { selectSelectedItems } from '../store';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const selectedItems = useSelector((state: RootState) =>
    selectSelectedItems(state)
  );
  const selectedItemIds = selectedItems.map((item) => item.id);

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
    setSearchTerm(term);
    setLocalSearchTerm(term);
    onSearchSubmit(term);
    setSearchParams({ page: '1' });
    fetchData(term);
  };

  const handleThrowError = () => {
    setForceError(true);
  };

  const itemsPerPage = 10;
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const handleCardClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const page = searchParams.get('page') || '1';
    navigate(`/details/${id}?frontpage=${page}`);
  };

  const handleSelectChange = (id: string, selected: boolean) => {
    const item = items.find((item) => item.id === id);
    if (!item) return;
    if (selected) {
      dispatch(selectItem(item));
    } else {
      dispatch(unselectItem(id));
    }
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
      ) : items.length > 0 ? (
        <>
          <CardList
            items={currentItems}
            onCardClick={handleCardClick}
            selectedItemIds={selectedItemIds}
            onSelectChange={handleSelectChange}
          />
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
