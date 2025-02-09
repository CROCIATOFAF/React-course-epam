import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Search from '../components/Search/Search';

vi.mock('../utils/storage', () => ({
  getSearchTerm: () => 'initial search',
  setSearchTerm: vi.fn(),
}));

import { setSearchTerm } from '../utils/storage';
import type { Mock } from 'vitest';
const mockedSetSearchTerm = setSearchTerm as unknown as Mock;

describe('Search Component', () => {
  const onSearchSubmitMock = vi.fn();

  beforeEach(() => {
    onSearchSubmitMock.mockClear();
    mockedSetSearchTerm.mockClear();
  });

  it('retrieves the value from local storage on mount', () => {
    render(<Search onSearchSubmit={onSearchSubmitMock} />);
    const input = screen.getByPlaceholderText(/Search for .../i);
    expect(input).toHaveValue('initial search');
  });

  it('calls onSearchSubmit with trimmed value and saves to local storage when search button is clicked', () => {
    render(<Search onSearchSubmit={onSearchSubmitMock} />);
    const input = screen.getByPlaceholderText(/Search for .../i);
    const button = screen.getByRole('button', { name: /Search/i });

    fireEvent.change(input, { target: { value: '  Orion  ' } });
    fireEvent.click(button);

    expect(onSearchSubmitMock).toHaveBeenCalledWith('Orion');
    expect(mockedSetSearchTerm).toHaveBeenCalledWith('Orion');
  });
});
