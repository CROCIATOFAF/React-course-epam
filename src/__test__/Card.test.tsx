import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../components/Card/Card';

describe('Card Component', () => {
  const onClickMock = jest.fn();
  const onSelectChangeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders image when provided, along with title and description', () => {
    const props = {
      id: '123',
      title: 'Test Card',
      description: 'This is a test card description',
      image: 'http://example.com/image.jpg',
      onClick: onClickMock,
      isSelected: false,
      onSelectChange: onSelectChangeMock,
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
      isSelected: false,
      onSelectChange: onSelectChangeMock,
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
      isSelected: false,
      onSelectChange: onSelectChangeMock,
    };

    render(<Card {...props} />);
    const cardElement = screen.getByText('Test Card').closest('div');

    if (cardElement) {
      fireEvent.click(cardElement);
    }

    expect(onClickMock).toHaveBeenCalledTimes(1);
    expect(onClickMock).toHaveBeenCalledWith('123', expect.anything);
  });

  it('calls onSelectChange with correct arguments when checkbox is clicked', () => {
    const props = {
      id: '123',
      title: 'Test Card',
      description: 'This is a test card description',
      image: 'http://example.com/image.jpg',
      onClick: onClickMock,
      isSelected: false,
      onSelectChange: onSelectChangeMock,
    };

    render(<Card {...props} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);
    expect(onSelectChangeMock).toHaveBeenCalledTimes(1);
    expect(onSelectChangeMock).toHaveBeenCalledWith('123', true);
  });
});
