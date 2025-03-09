import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailCard from '../components/DetailCard/DetailCard';
import { useFetchDetailQuery } from '../components/services/api';
import { useSearchParams } from 'next/navigation';

const mockRouterPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: mockRouterPush })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

jest.mock('../components/services/api', () => ({
  useFetchDetailQuery: jest.fn(),
}));

describe('DetailCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner when loading', () => {
    (useFetchDetailQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      data: undefined,
      error: undefined,
    });

    render(<DetailCard id="test-id" />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('renders "No details available." when API call fails', () => {
    (useFetchDetailQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: undefined,
      error: new Error('Test error'),
    });

    render(<DetailCard id="test-id" />);
    expect(screen.getByText(/no details available/i)).toBeInTheDocument();
  });

  test('renders "No details available." when data is empty', () => {
    (useFetchDetailQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: { collection: { items: [] } },
      error: undefined,
    });

    render(<DetailCard id="test-id" />);
    expect(screen.getByText(/no details available/i)).toBeInTheDocument();
  });

  test('renders details when API data is available', () => {
    const mockData = {
      collection: {
        items: [
          {
            data: [
              {
                nasa_id: 'test-id',
                title: 'Test Title',
                description: 'Test Description',
              },
            ],
            links: [{ href: 'https://example.com/image.jpg' }],
          },
        ],
      },
    };

    (useFetchDetailQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockData,
      error: undefined,
    });

    render(<DetailCard id="test-id" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByAltText('Test Title')).toHaveAttribute(
      'src',
      'https://example.com/image.jpg'
    );
  });

  test('calls onClose when the close button is clicked', () => {
    const onCloseMock = jest.fn();
    const mockData = {
      collection: {
        items: [
          {
            data: [
              {
                nasa_id: 'test-id',
                title: 'Test Title',
                description: 'Test Description',
              },
            ],
            links: [{ href: 'https://example.com/image.jpg' }],
          },
        ],
      },
    };

    (useFetchDetailQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockData,
      error: undefined,
    });

    render(<DetailCard id="test-id" onClose={onCloseMock} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('navigates to frontpage when closed and onClose is not provided (with frontpage param)', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams('frontpage=home')
    );

    const mockData = {
      collection: {
        items: [
          {
            data: [
              {
                nasa_id: 'test-id',
                title: 'Test Title',
                description: 'Test Description',
              },
            ],
            links: [{ href: 'https://example.com/image.jpg' }],
          },
        ],
      },
    };

    (useFetchDetailQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockData,
      error: undefined,
    });

    render(<DetailCard id="test-id" />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockRouterPush).toHaveBeenCalledWith('/?frontpage=home');
  });

  test('navigates to home when closed and no frontpage query param', () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

    const mockData = {
      collection: {
        items: [
          {
            data: [
              {
                nasa_id: 'test-id',
                title: 'Test Title',
                description: 'Test Description',
              },
            ],
            links: [{ href: 'https://example.com/image.jpg' }],
          },
        ],
      },
    };

    (useFetchDetailQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockData,
      error: undefined,
    });

    render(<DetailCard id="test-id" />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockRouterPush).toHaveBeenCalledWith('/');
  });
});
