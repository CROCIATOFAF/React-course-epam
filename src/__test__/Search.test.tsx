import { render, screen, fireEvent } from '@testing-library/react';
import Search from '../components/Search/Search';
import { setSearchTerm } from '../utils/storage';

jest.mock('@/utils/storage', () => ({
  getSearchTerm: jest.fn(() => ''),
  setSearchTerm: jest.fn(),
}));

describe('Search Component', () => {
  const onSearchSubmitMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retrieves the value from local storage on mount', () => {
    render(<Search onSearchSubmit={onSearchSubmitMock} />);
    const input = screen.getByPlaceholderText(/Search for .../i);
    expect(input).toHaveValue('');
  });

  it('calls onSearchSubmit with trimmed value and saves to local storage when search button is clicked', () => {
    render(<Search onSearchSubmit={onSearchSubmitMock} />);
    const input = screen.getByPlaceholderText(/Search for .../i);
    const button = screen.getByRole('button', { name: /Search/i });

    fireEvent.change(input, { target: { value: '  Orion  ' } });
    fireEvent.click(button);

    expect(onSearchSubmitMock).toHaveBeenCalledWith('Orion');
    expect(setSearchTerm).toHaveBeenCalledWith('Orion');
  });

  it('calls onSearchSubmit when Enter key is pressed', () => {
    render(<Search onSearchSubmit={onSearchSubmitMock} />);
    const input = screen.getByPlaceholderText(/Search for .../i);

    fireEvent.change(input, { target: { value: 'Galaxy' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSearchSubmitMock).toHaveBeenCalledWith('Galaxy');
    expect(setSearchTerm).toHaveBeenCalledWith('Galaxy');
  });

  it('disables search button when input is empty', () => {
    render(<Search onSearchSubmit={onSearchSubmitMock} />);
    const button = screen.getByRole('button', { name: /Search/i });
    expect(button).toBeDisabled();

    const input = screen.getByPlaceholderText(/Search for .../i);
    fireEvent.change(input, { target: { value: 'Saturn' } });
    expect(button).not.toBeDisabled();
  });

  it('does not call onSearchSubmit if input is only whitespace', () => {
    render(<Search onSearchSubmit={onSearchSubmitMock} />);
    const input = screen.getByPlaceholderText(/Search for .../i);
    const button = screen.getByRole('button', { name: /Search/i });

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    expect(onSearchSubmitMock).not.toHaveBeenCalled();
    expect(setSearchTerm).not.toHaveBeenCalled();
  });
});
