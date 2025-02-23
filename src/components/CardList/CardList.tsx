import React from 'react';
import Card from '../Card/Card';
import styles from './CardList.module.css';
import { CardData } from '../services/nasaApi';

interface CardListProps {
  items: CardData[];
  onCardClick: (id: string, e: React.MouseEvent) => void;
  selectedItemIds: string[];
  onSelectChange: (id: string, selected: boolean) => void;
}

const CardList: React.FC<CardListProps> = ({
  items,
  onCardClick,
  selectedItemIds,
  onSelectChange,
}) => {
  if (!items || items.length === 0) {
    return <div>No results found.</div>;
  }
  return (
    <div className={styles.cardList}>
      {items.map((item) => (
        <Card
          data-testid="card"
          key={item.id}
          id={item.id}
          title={item.title}
          description={item.description}
          image={item.image}
          onClick={onCardClick}
          isSelected={selectedItemIds.includes(item.id)}
          onSelectChange={onSelectChange}
        />
      ))}
    </div>
  );
};

export default CardList;
