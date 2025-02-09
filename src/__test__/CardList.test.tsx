import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CardList from '../components/CardList/CardList';
import { CardData } from '../components/services/nasaApi';

const dummyCards: CardData[] = [
  {
    id: '1',
    title: 'Card One',
    description: 'First description',
    image: 'http://example.com/one.jpg',
  },
  {
    id: '2',
    title: 'Card Two',
    description: 'Second description',
    image: 'http://example.com/two.jpg',
  },
];

describe('CardList Component', () => {
  const onCardClickMock = vi.fn();

  it('renders the specified number of cards', () => {
    render(<CardList items={dummyCards} onCardClick={onCardClickMock} />);
    expect(screen.getByText('Card One')).toBeInTheDocument();
    expect(screen.getByText('Card Two')).toBeInTheDocument();
  });

  it('displays an appropriate message if no cards are present', () => {
    render(<CardList items={[]} onCardClick={onCardClickMock} />);
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('calls onCardClick when a card is clicked', () => {
    render(<CardList items={dummyCards} onCardClick={onCardClickMock} />);
    const cardElement = screen.getByText('Card One').closest('div');
    if (cardElement) {
      fireEvent.click(cardElement);
    }
    expect(onCardClickMock).toHaveBeenCalledTimes(1);
    expect(onCardClickMock.mock.calls[0][0]).toBe('1');
    expect(onCardClickMock.mock.calls[0][1].nativeEvent).toBeInstanceOf(
      MouseEvent
    );
  });
});
