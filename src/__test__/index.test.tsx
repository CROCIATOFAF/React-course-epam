import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Home from '../pages';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useFetchNasaImagesQuery } from '../components/services/api';

jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    query: {},
    push: jest.fn(),
  }),
}));

jest.mock('../components/services/api', () => ({
  ...jest.requireActual('../components/services/api'),
  useFetchNasaImagesQuery: jest.fn(),
}));

const mockedUseFetchNasaImagesQuery = useFetchNasaImagesQuery as jest.Mock;

const renderHome = () =>
  render(
    <Provider store={store}>
      <Home />
    </Provider>
  );

describe('Home Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state when isLoading is true', () => {
    mockedUseFetchNasaImagesQuery.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });
    renderHome();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders error message when API call fails', () => {
    const error = new Error('API failure');
    mockedUseFetchNasaImagesQuery.mockReturnValue({
      data: undefined,
      error,
      isLoading: false,
    });
    renderHome();

    expect(screen.getByText(/Error: API failure/)).toBeInTheDocument();
  });

  test('renders CardList and Pagination when data is available', () => {
    const fakeData = [
      { id: '1', title: 'Image 1', description: 'Desc 1', image: 'url1' },
      { id: '2', title: 'Image 2', description: 'Desc 2', image: 'url2' },
    ];
    mockedUseFetchNasaImagesQuery.mockReturnValue({
      data: fakeData,
      error: undefined,
      isLoading: false,
    });
    renderHome();

    expect(screen.getByText('Image 1')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
  });

  test('renders "No results found." when data is empty', () => {
    mockedUseFetchNasaImagesQuery.mockReturnValue({
      data: [],
      error: undefined,
      isLoading: false,
    });
    renderHome();

    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  // later add more tests to simulate search submission, card clicks, etc.
});
