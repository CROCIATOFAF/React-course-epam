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

    expect(screen.getByTestId('card-image')).toBeInTheDocument();
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(
      screen.getByText('This is a test card description')
    ).toBeInTheDocument();
  });

  it('renders placeholder text when image is not provided', () => {
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

  it('calls onClick with the correct id when the card is clicked', () => {
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

    const cardElement = screen.getByTestId('card-container');
    expect(cardElement).toBeInTheDocument();

    fireEvent.click(cardElement);

    expect(onClickMock).toHaveBeenCalledTimes(1);
    expect(onClickMock.mock.calls[0][0]).toBe('123');
  });

  it('calls onSelectChange when the checkbox is clicked', () => {
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

    const checkbox = screen.getByTestId('card-checkbox');
    expect(checkbox).toBeInTheDocument();

    fireEvent.click(checkbox);

    expect(onSelectChangeMock).toHaveBeenCalledTimes(1);
    expect(onSelectChangeMock.mock.calls[0][0]).toBe('123');
    expect(onSelectChangeMock.mock.calls[0][1]).toBe(true);
  });
});
