import { Component } from 'react';
import styles from './Home.module.css';
import Search from '../components/Search/Search';
import CardList from '../components/CardList/CardList';
import { fetchNasaImages, CardData } from '../components/services/nasaApi';
import { getSearchTerm, setSearchTerm } from '../utils/storage';
import Spinner from '../components/Spinner/Spinner';

interface ApiError extends Error {
  code?: number;
}

type HomeProps = Record<string, never>;

interface HomeState {
  items: CardData[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  forceError: boolean;
}

class Home extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    const savedTerm = getSearchTerm();
    this.state = {
      items: [],
      loading: false,
      error: null,
      searchTerm: savedTerm,
      forceError: false,
    };
  }

  componentDidMount() {
    const term = this.state.searchTerm.trim();
    this.fetchData(term);
  }

  fetchData = (searchTerm: string) => {
    this.setState({ loading: true, error: null });
    fetchNasaImages(searchTerm)
      .then((items) => {
        this.setState({ items, loading: false });
      })
      .catch((error: unknown) => {
        console.error('[Home] Error fetching data:', error);
        let errorMessage = '';
        if (error instanceof Error) {
          const apiError = error as ApiError;
          errorMessage = apiError.code
            ? `${apiError.message} (Code: ${apiError.code})`
            : apiError.message;
        } else {
          errorMessage = 'An unexpected error occurred.';
        }
        this.setState({ error: errorMessage, loading: false });
      });
  };

  handleSearchSubmit = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    this.setState({ searchTerm });
    this.fetchData(searchTerm);
  };

  handleThrowError = () => {
    this.setState({ forceError: true });
  };

  render() {
    const { items, loading, error, forceError } = this.state;
    if (forceError) {
      throw new Error('This is a forced render error!');
    }
    return (
      <div className={styles.homeContainer}>
        <Search onSearchSubmit={this.handleSearchSubmit} />
        {loading && <Spinner />}
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className={styles.errorMessage}>Error: {error}</div>
        ) : (
          <CardList items={items} />
        )}
        <button onClick={this.handleThrowError} className={styles.errorButton}>
          Throw Error
        </button>
      </div>
    );
  }
}

export default Home;
