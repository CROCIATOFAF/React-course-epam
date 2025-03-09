import { render, screen } from '@testing-library/react';
import Spinner from '../components/Spinner/Spinner';
import '@testing-library/jest-dom';

describe('Spinner Component', () => {
  it('renders the spinner element', () => {
    render(<Spinner />);
    const spinnerElement = screen.getByTestId('spinner');
    expect(spinnerElement).toBeInTheDocument();
  });
});
