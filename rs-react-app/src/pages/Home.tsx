import { Component } from 'react';
import Search from '../components/Search/Search';
import CardList from '../components/CardList/CardList';
import { fetchNasaImages, CardData } from '../components/services/nasaApi';
import { getSearchTerm, setSearchTerm } from '../utils/storage';

type HomeProps = Record<string, never>;

interface HomeState {
  items: CardData[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
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

  render() {
    const { items, loading, error } = this.state;
    return (
      <div>
        <Search onSearchSubmit={this.handleSearchSubmit} />
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>Error: {error}</div>
        ) : (
          <CardList items={items} />
        )}
      </div>
    );
  }
}

export default Home;
