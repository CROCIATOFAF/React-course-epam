import { render, screen, fireEvent } from '@testing-library/react';
import DetailCard from '../components/DetailCard/DetailCard';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import { vi, type Mock } from 'vitest';

vi.mock('../components/services/api', async () => {
  const actual = await vi.importActual('../components/services/api');
  return {
    ...actual,
    useFetchDetailQuery: vi.fn(),
  };
});
import { useFetchDetailQuery } from '../components/services/api';
const mockedUseFetchDetailQuery = useFetchDetailQuery as unknown as Mock;

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const renderWithProviders = (
  ui: React.ReactElement,
  { route = '/details/123?frontpage=1' } = {}
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/details/:id" element={ui} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('DetailCard Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders spinner when loading', () => {
    mockedUseFetchDetailQuery.mockReturnValue({
      isLoading: true,
      data: undefined,
      error: undefined,
    });

    renderWithProviders(<DetailCard />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders "No details available." when error occurs', () => {
    mockedUseFetchDetailQuery.mockReturnValue({
      isLoading: false,
      data: undefined,
      error: new Error('Test error'),
    });

    renderWithProviders(<DetailCard />);
    expect(screen.getByText(/No details available/i)).toBeInTheDocument();
  });

  it('renders "No details available." when data collection is empty', () => {
    mockedUseFetchDetailQuery.mockReturnValue({
      isLoading: false,
      data: { collection: { items: [] } },
      error: undefined,
    });

    renderWithProviders(<DetailCard />);
    expect(screen.getByText(/No details available/i)).toBeInTheDocument();
  });

  it('renders "No details available." when dataItem is not available', () => {
    mockedUseFetchDetailQuery.mockReturnValue({
      isLoading: false,
      data: { collection: { items: [{ data: [] }] } },
      error: undefined,
    });

    renderWithProviders(<DetailCard />);
    expect(screen.getByText(/No details available/i)).toBeInTheDocument();
  });

  it('renders detail card when valid data is available', () => {
    mockedUseFetchDetailQuery.mockReturnValue({
      isLoading: false,
      data: {
        collection: {
          items: [
            {
              data: [
                {
                  nasa_id: '123',
                  title: 'Test Title',
                  description: 'Test Description',
                },
              ],
              links: [
                {
                  href: 'test.jpg',
                  rel: 'preview',
                  render: 'image',
                },
              ],
            },
          ],
        },
      },
      error: undefined,
    });

    renderWithProviders(<DetailCard />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText(/Description:/i)).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    const img = screen.getByAltText('Test Title');
    expect(img).toHaveAttribute('src', 'test.jpg');
  });

  it('renders fallback image when links are missing', () => {
    mockedUseFetchDetailQuery.mockReturnValue({
      isLoading: false,
      data: {
        collection: {
          items: [
            {
              data: [
                {
                  nasa_id: '123',
                  title: 'Test Title',
                  description: 'Test Description',
                },
              ],
              links: undefined,
            },
          ],
        },
      },
      error: undefined,
    });

    renderWithProviders(<DetailCard />);
    const img = screen.getByAltText('Test Title');
    expect(img).toHaveAttribute(
      'src',
      'https://images-assets.nasa.gov/image/123/123~thumb.jpg'
    );
  });

  it('calls navigate with correct path when Close button is clicked', () => {
    mockedUseFetchDetailQuery.mockReturnValue({
      isLoading: false,
      data: {
        collection: {
          items: [
            {
              data: [
                {
                  nasa_id: '123',
                  title: 'Test Title',
                  description: 'Test Description',
                },
              ],
              links: [
                {
                  href: 'test.jpg',
                  rel: 'preview',
                  render: 'image',
                },
              ],
            },
          ],
        },
      },
      error: undefined,
    });

    renderWithProviders(<DetailCard />);
    const closeButton = screen.getByText(/Close/i);
    fireEvent.click(closeButton);
    expect(navigateMock).toHaveBeenCalledWith('/?frontpage=1');
  });
});
