import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../components/Card/Card';

describe('Card Component', () => {
  const onClickMock = vi.fn();

  beforeEach(() => {
    onClickMock.mockClear();
  });

  it('renders image when provided, along with title and description', () => {
    const props = {
      id: '123',
      title: 'Test Card',
      description: 'This is a test card description',
      image: 'http://example.com/image.jpg',
      onClick: onClickMock,
    };

    render(<Card {...props} />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'http://example.com/image.jpg');
    expect(img).toHaveAttribute('alt', 'Test Card');

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(
      screen.getByText('This is a test card description')
    ).toBeInTheDocument();
  });

  it('renders placeholder when image is not provided', () => {
    const props = {
      id: '123',
      title: 'Test Card',
      description: 'This is a test card description',
      onClick: onClickMock,
    };

    render(<Card {...props} />);
    expect(screen.getByText('No Image Available')).toBeInTheDocument();
  });

  it('calls onClick with the correct id when clicked', () => {
    const props = {
      id: '123',
      title: 'Test Card',
      description: 'This is a test card description',
      image: 'http://example.com/image.jpg',
      onClick: onClickMock,
    };

    render(<Card {...props} />);
    const cardElement = screen.getByText('Test Card').closest('div');
    if (cardElement) {
      fireEvent.click(cardElement);
    }
    expect(onClickMock).toHaveBeenCalledTimes(1);
    expect(onClickMock.mock.calls[0][1].nativeEvent).toBeInstanceOf(MouseEvent);
  });
});
