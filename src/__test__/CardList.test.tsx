import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import CardList from '../components/CardList/CardList';
import { CardData } from '../components/services/nasaApi';
import '@testing-library/jest-dom';

const mockItems: CardData[] = [
  { id: '1', title: 'Title 1', description: 'Desc 1', image: 'img1.jpg' },
  { id: '2', title: 'Title 2', description: 'Desc 2', image: 'img2.jpg' },
];

const mockOnCardClick = jest.fn();
const mockOnSelectChange = jest.fn();
const selectedItemIds = ['1'];

afterEach(() => {
  jest.clearAllMocks();
});

describe('CardList Component', () => {
  it('renders "No results found." when items list is empty', () => {
    render(
      <CardList
        items={[]}
        onCardClick={mockOnCardClick}
        onSelectChange={mockOnSelectChange}
        selectedItemIds={[]}
      />
    );
    expect(screen.getByText(/No results found/i)).toBeInTheDocument();
  });

  it('renders a list of cards when items are provided', () => {
    render(
      <CardList
        items={mockItems}
        onCardClick={mockOnCardClick}
        onSelectChange={mockOnSelectChange}
        selectedItemIds={selectedItemIds}
      />
    );

    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(2);
    expect(screen.getByText('Title 1')).toBeInTheDocument();
    expect(screen.getByText('Title 2')).toBeInTheDocument();
  });

  it('calls onCardClick when a card is clicked', () => {
    render(
      <CardList
        items={mockItems}
        onCardClick={mockOnCardClick}
        onSelectChange={mockOnSelectChange}
        selectedItemIds={selectedItemIds}
      />
    );

    const firstCard = screen.getAllByTestId('card')[0];
    fireEvent.click(firstCard);

    expect(mockOnCardClick).toHaveBeenCalledTimes(1);
    expect(mockOnCardClick).toHaveBeenCalledWith('1', expect.any(Object));
  });

  it('calls onSelectChange when the checkbox is toggled', () => {
    render(
      <CardList
        items={mockItems}
        onCardClick={mockOnCardClick}
        onSelectChange={mockOnSelectChange}
        selectedItemIds={selectedItemIds}
      />
    );

    const secondCard = screen.getAllByTestId('card')[1];
    expect(secondCard).toBeInTheDocument();
    const checkbox = within(secondCard).getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();

    fireEvent.click(checkbox);

    expect(mockOnSelectChange).toHaveBeenCalledTimes(1);
    expect(mockOnSelectChange).toHaveBeenCalledWith('2', true);
  });
});
