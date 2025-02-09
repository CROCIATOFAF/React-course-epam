import React from 'react';
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';

vi.mock('../components/services/nasaApi', () => ({
  fetchNasaImages: vi.fn(),
}));
import { fetchNasaImages } from '../components/services/nasaApi';

vi.mock('../utils/storage', () => ({
  getSearchTerm: () => 'default',
  setSearchTerm: vi.fn(),
}));
import { setSearchTerm } from '../utils/storage';

const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('Home Component', () => {
  const onSearchSubmitMock = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders spinner while loading then displays card list and pagination when data is fetched', async () => {
    const fakeCards = Array.from({ length: 15 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Card ${i + 1}`,
      description: `Description ${i + 1}`,
      image: `http://example.com/image${i + 1}.jpg`,
    }));
    (fetchNasaImages as vi.Mock).mockResolvedValue(fakeCards);

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={<Home onSearchSubmit={onSearchSubmitMock} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Card 1')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
  });

  it('displays error message when fetch fails', async () => {
    (fetchNasaImages as vi.Mock).mockRejectedValue(new Error('API error'));

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={<Home onSearchSubmit={onSearchSubmitMock} />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });

  it('calls onSearchSubmit with trimmed value and updates local storage when search button is clicked', async () => {
    (fetchNasaImages as vi.Mock).mockResolvedValue([]);
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={<Home onSearchSubmit={onSearchSubmitMock} />}
          />
        </Routes>
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Search for .../i);
    const button = screen.getByRole('button', { name: /Search/i });

    fireEvent.change(input, { target: { value: '  Orion  ' } });
    fireEvent.click(button);

    expect(onSearchSubmitMock).toHaveBeenCalledWith('Orion');
    expect(setSearchTerm).toHaveBeenCalledWith('Orion');

    await waitFor(() => {
      expect(screen.getByText('No results found.')).toBeInTheDocument();
    });
  });

  it('throws an error when "Throw Error" button is clicked', () => {
    (fetchNasaImages as vi.Mock).mockResolvedValue([]);
    expect(() =>
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route
              path="/"
              element={<Home onSearchSubmit={onSearchSubmitMock} />}
            />
          </Routes>
        </MemoryRouter>
      )
    ).not.toThrow();

    const throwButton = screen.getByRole('button', { name: /Throw Error/i });
    expect(() => fireEvent.click(throwButton)).toThrow(
      'This is a forced render error!'
    );
  });
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
});
