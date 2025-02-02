import { Component } from 'react';
import styles from './Home.module.css';
import Search from '../components/Search/Search';
import CardList from '../components/CardList/CardList';
import { fetchNasaImages, CardData } from '../components/services/nasaApi';
import { getSearchTerm, setSearchTerm } from '../utils/storage';
import Spinner from '../components/Spinner/Spinner';

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
    console.log('[Home] Fetching data for:', searchTerm);
    this.setState({ loading: true, error: null });
    fetchNasaImages(searchTerm)
      .then((items) => {
        console.log('[Home] Fetched items:', items);
        this.setState({ items, loading: false });
      })
      .catch((error: Error) => {
        console.error('[Home] Error fetching data:', error);
        this.setState({ error: error.message, loading: false });
      });
  };

  handleSearchSubmit = (searchTerm: string) => {
    console.log('[Home] Received search term:', searchTerm);
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

        {error && <div className={styles.errorMessage}>{error}</div>}

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
