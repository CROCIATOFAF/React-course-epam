import { render, screen, fireEvent } from '@testing-library/react';
import MainLayout from '../components/MainLayout/MainLayout';
import { useRouter } from 'next/router';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('MainLayout Component', () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/',
      query: {},
      push: pushMock,
    });
  });

  it('renders only the left section when not on a /details route', () => {
    render(<MainLayout />);

    expect(screen.getByRole('heading', { name: /Home/i })).toBeInTheDocument();
    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();
  });

  it('renders both left and right sections when pathname starts with /details', () => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/details/123',
      query: { frontpage: '2' },
      push: pushMock,
    });

    render(
      <MainLayout>
        <div data-testid="outlet">Mocked Detail View</div>
      </MainLayout>
    );

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it("navigates to '/' when the left section is clicked while details are open", () => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/details/123',
      query: { frontpage: '2' },
      push: pushMock,
    });

    render(<MainLayout />);

    const leftSection = screen.getByRole('heading', {
      name: /Home/i,
    }).parentElement;
    fireEvent.click(leftSection!);

    expect(pushMock).toHaveBeenCalledWith('/?frontpage=2');
  });

  it("navigates to '/' when the Home heading is clicked", () => {
    render(<MainLayout />);

    const homeHeading = screen.getByRole('heading', { name: /Home/i });
    fireEvent.click(homeHeading);

    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
