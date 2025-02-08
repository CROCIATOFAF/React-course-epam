// src/components/Card/Card.tsx
import React from 'react';
import styles from './Card.module.css';
import './Card.module.css';

interface CardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
  onClick: (id: string, e: React.MouseEvent) => void;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  description,
  image,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    onClick(id, e);
  };

  return (
    <div className={styles.card || 'card'} onClick={handleClick}>
      {image ? (
        <img src={image} alt={title} className={styles.image || 'card-image'} />
      ) : (
        <div className={styles.placeholder || 'card-placeholder'}>
          No Image Available
        </div>
      )}
      <h3>{title}</h3>
      <h4>Description:</h4>
      <p>{description}</p>
    </div>
  );
};

export default Card;
