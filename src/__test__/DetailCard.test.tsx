import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DetailCard from '../components/DetailCard/DetailCard';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('DetailCard Component', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => ({
        collection: {
          items: [
            {
              data: [
                {
                  nasa_id: 'test123',
                  title: 'Test Detail Card',
                  description: 'Test description from API',
                },
              ],
            },
          ],
        },
      }),
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('displays a spinner while loading and then shows detailed data', async () => {
    render(
      <MemoryRouter initialEntries={['/details/test123?frontpage=1']}>
        <Routes>
          <Route path="/details/:id" element={<DetailCard />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Detail Card')).toBeInTheDocument();
      expect(screen.getByText('Test description from API')).toBeInTheDocument();
    });
  });

  it('navigates away when the close button is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/details/test123?frontpage=1']}>
        <Routes>
          <Route path="/details/:id" element={<DetailCard />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Test Detail Card')).toBeInTheDocument();
    });
    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);
    expect(navigateMock).toHaveBeenCalledWith('/?frontpage=1');
  });
});
