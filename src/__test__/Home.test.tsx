import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, type Mock } from 'vitest';
import Home from '../pages/Home';
import { Provider } from 'react-redux';
import { store } from '../store';

const navigateMock = vi.fn();
const setSearchParamsMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useSearchParams: () => [new URLSearchParams('page=1'), setSearchParamsMock],
  };
});

vi.mock('../components/services/api', async () => {
  const actual = await vi.importActual('../components/services/api');
  return {
    ...actual,
    useFetchNasaImagesQuery: vi.fn(),
  };
});
import { useFetchNasaImagesQuery } from '../components/services/api';
const mockedUseFetchNasaImagesQuery =
  useFetchNasaImagesQuery as unknown as Mock;

vi.mock('../utils/storage', () => ({
  getSearchTerm: () => '',
  setSearchTerm: vi.fn(),
}));

vi.mock('../components/CardList/CardList', () => {
  return {
    default: ({
      items,
      onCardClick,
    }: {
      items: { id: string; title: string }[];
      onCardClick: (id: string, e: React.MouseEvent) => void;
    }) => (
      <div>
        {items.map((item) => (
          <div
            key={item.id}
            data-testid="card"
            onClick={(e) => onCardClick(item.id, e)}
          >
            {item.title}
          </div>
        ))}
      </div>
    ),
  };
});

interface ErrorBoundaryProps {
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
class TestErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div data-testid="error-fallback">{this.state.error?.message}</div>
      );
    }
    return this.props.children;
  }
}

const renderHome = (onSearchSubmit = vi.fn()) => {
  return render(
    <Provider store={store}>
      <TestErrorBoundary>
        <Home onSearchSubmit={onSearchSubmit} />
      </TestErrorBoundary>
    </Provider>
  );
};

describe('Home Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders spinner and loading text when loading', () => {
    mockedUseFetchNasaImagesQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    });
    renderHome();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders error message when API call fails', () => {
    const error = new Error('API failure');
    mockedUseFetchNasaImagesQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error,
    });
    renderHome();
    const errorElements = screen.getAllByText(/error/i);
    expect(
      errorElements.some((el) => el.textContent?.includes('API failure'))
    ).toBe(true);
  });

  test('renders empty state when no cards are returned', () => {
    mockedUseFetchNasaImagesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: undefined,
    });
    renderHome();
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  test('renders card list and pagination when data is fetched', () => {
    const data = [
      {
        id: '1',
        title: 'Test Image 1',
        description: 'Description 1',
        image: 'http://example.com/1.jpg',
      },
      {
        id: '2',
        title: 'Test Image 2',
        description: 'Description 2',
        image: 'http://example.com/2.jpg',
      },
    ];
    mockedUseFetchNasaImagesQuery.mockReturnValue({
      data,
      isLoading: false,
      error: undefined,
    });
    renderHome();
    expect(screen.getByText('Test Image 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
  });

  test('calls onSearchSubmit when the search form is submitted', async () => {
    mockedUseFetchNasaImagesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: undefined,
    });
    const onSearchSubmitMock = vi.fn();
    renderHome(onSearchSubmitMock);

    const input = screen.getByPlaceholderText('Search for ... (e.g. "Orion")');
    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.clear(input);
    await userEvent.type(input, 'Orion');

    await waitFor(() => {
      expect(input).toHaveValue('Orion');
    });
    expect(searchButton).not.toBeDisabled();

    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(onSearchSubmitMock).toHaveBeenCalledWith('Orion');
    });
  });

  test('navigates to details page when a card is clicked', async () => {
    const data = [
      {
        id: '1',
        title: 'Test Image 1',
        description: 'Description 1',
        image: 'http://example.com/1.jpg',
      },
    ];
    mockedUseFetchNasaImagesQuery.mockReturnValue({
      data,
      isLoading: false,
      error: undefined,
    });
    renderHome();

    const card = screen.getByTestId('card');
    await userEvent.click(card);
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/details/1?frontpage=1');
    });
  });

  test('renders fallback UI when forced error is triggered', async () => {
    mockedUseFetchNasaImagesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: undefined,
    });
    renderHome();

    const throwErrorButton = screen.getByTestId('throw-error-button');
    await userEvent.click(throwErrorButton);
    const fallback = await screen.findByTestId('error-fallback');
    expect(fallback).toHaveTextContent('This is a forced render error!');
  });
});
