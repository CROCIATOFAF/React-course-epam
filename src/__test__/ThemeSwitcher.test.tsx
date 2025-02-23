import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSwitcher from '../components/ThemeSwitcher/ThemeSwitcher';
import { ThemeContext, Theme } from '../context/ThemeContext';

const mockSetTheme = vi.fn();

const renderWithThemeContext = (theme: Theme = 'dark') => {
  return render(
    <ThemeContext.Provider value={{ theme, setTheme: mockSetTheme }}>
      <ThemeSwitcher />
    </ThemeContext.Provider>
  );
};

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it('renders a label and a select element with options', () => {
    renderWithThemeContext('dark');

    expect(screen.getByLabelText(/Select Theme:/i)).toBeInTheDocument();

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('dark');

    expect(screen.getByRole('option', { name: /Dark/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Light/i })).toBeInTheDocument();
  });

  it('calls setTheme when a new theme is selected', () => {
    renderWithThemeContext('dark');
    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'light' } });

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });
});
