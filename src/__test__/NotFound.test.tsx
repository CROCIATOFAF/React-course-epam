import { render, screen } from '@testing-library/react';
import NotFound from '../components/NotFound/NotFound';
import '@testing-library/jest-dom';

describe('NotFound Component', () => {
  it('renders the 404 message and description', () => {
    render(<NotFound />);

    const heading = screen.getByText(/404 - Page Not Found/i);
    const description = screen.getByText(
      /The page you are looking for does not exist./i
    );

    expect(heading).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it('renders the error image', () => {
    render(<NotFound />);
    const errorImage = screen.getByAltText('error window image');

    expect(errorImage).toBeInTheDocument();
    expect(errorImage).toHaveAttribute('src', '/error.svg');
  });
});
