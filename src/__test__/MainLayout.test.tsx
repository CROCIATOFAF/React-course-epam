import { vi } from 'vitest';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('../pages/Home', () => ({
  __esModule: true,
  default: () => <div data-testid="home">Mocked Home</div>,
}));

import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/MainLayout/MainLayout';

describe('MainLayout Component', () => {
  beforeEach(() => {
    navigateMock.mockReset();
  });

  it('renders only the left section when not on a /details route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId('home')).toBeInTheDocument();
    expect(screen.queryByTestId('outlet')).toBeNull();
  });

  it('renders both left and right sections when pathname starts with /details', () => {
    const DummyOutlet = () => <div>Dummy Outlet</div>;

    render(
      <MemoryRouter initialEntries={['/details/123?frontpage=2']}>
        <Routes>
          <Route path="/*" element={<MainLayout />}>
            <Route path="details/:id" element={<DummyOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId('home')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('navigates away when left section is clicked while details are open', () => {
    const DummyOutlet = () => <div>Dummy Outlet</div>;

    render(
      <MemoryRouter initialEntries={['/details/123?frontpage=2']}>
        <Routes>
          <Route path="/*" element={<MainLayout />}>
            <Route path="details/:id" element={<DummyOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const homeElement = screen.getByTestId('home');
    const leftSection = homeElement.parentElement;
    if (leftSection) {
      fireEvent.click(leftSection);
    }
    expect(navigateMock).toHaveBeenCalledWith('/?frontpage=2');
  });
});
