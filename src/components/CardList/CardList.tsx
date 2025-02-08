import React from 'react';
import Card from '../Card/Card';
import styles from './CardList.module.css';
import './CardList.module.css';
import { CardData } from '../services/nasaApi';

interface CardListProps {
  items: CardData[];
  onCardClick: (id: string, e: React.MouseEvent) => void;
}

const CardList: React.FC<CardListProps> = ({ items, onCardClick }) => {
  if (!items || items.length === 0) {
    return <div>No results found.</div>;
  }
  return (
    <div className={styles.cardList || 'card-list'}>
      {items.map((item) => (
        <Card
          key={item.id}
          id={item.id}
          title={item.title}
          description={item.description}
          image={item.image}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
};

export default CardList;
