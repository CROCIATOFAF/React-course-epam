import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/index.module.css';
import VideoBackground from '../components/VideoBackground/VideoBackground';
import Search from '../components/Search/Search';
import CardList from '../components/CardList/CardList';
import Spinner from '../components/Spinner/Spinner';
import Pagination from '../components/Pagination/Pagination';
import DetailCard from '../components/DetailCard/DetailCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, selectItem, unselectItem } from '../store';
import { selectSelectedItems } from '../store';
import { getSearchTerm, setSearchTerm } from '../utils/storage';
import { useFetchNasaImagesQuery } from '../components/services/api';
import { CardData } from '../components/services/nasaApi';

const Home: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedItems = useSelector((state: RootState) =>
    selectSelectedItems(state)
  );
  const selectedItemIds = selectedItems.map((item) => item.id);

  const [searchTerm, setLocalSearchTerm] = useState<string>(getSearchTerm());
  const [forceError, setForceError] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<string | null>(null);

  const currentPage = Number(router.query.page) || 1;

  const { data, error, isLoading } = useFetchNasaImagesQuery(searchTerm);
  const items: CardData[] = data || [];
  const itemsPerPage = 10;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchSubmit = (term: string) => {
    setSearchTerm(term);
    setLocalSearchTerm(term);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: '1' },
    });
  };

  const handleThrowError = () => {
    setForceError(true);
  };

  const handlePageChange = (page: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: page.toString() },
    });
  };

  const handleCardClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetail(id);
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
      <VideoBackground />
      <Search onSearchSubmit={handleSearchSubmit} />

      {isLoading && <Spinner />}

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className={styles.errorMessage}>
          Error: {error instanceof Error ? error.message : 'An error occurred'}
        </div>
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

      {showDetail && (
        <div className={styles.overlay} onClick={() => setShowDetail(null)}>
          <div
            className={styles.sidePanel}
            onClick={(e) => e.stopPropagation()}
          >
            <DetailCard
              id={showDetail}
              onClose={() => setShowDetail(null)}
              key={showDetail}
            />
          </div>
        </div>
      )}

      <button
        data-testid="throw-error-button"
        onClick={handleThrowError}
        className={styles.errorButton}
      >
        Throw Error
      </button>
    </div>
  );
};

export default Home;
