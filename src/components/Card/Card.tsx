import React from 'react';
import styles from './Card.module.css';
import './Card.module.css';

interface CardProps {
  title: string;
  description: string;
  image?: string;
}

const Card: React.FC<CardProps> = ({ title, description, image }) => {
  return (
    <div className={styles.card || 'card'}>
      {image ? (
        <img src={image} alt={title} className={styles.image || 'card-image'} />
      ) : (
        <div className={styles.placeholder || 'card-placeholder'}>
          No Image Available
        </div>
      )}
      <h3>{title}</h3>
      <h4>Description :</h4>
      <p>{description}</p>
    </div>
  );
};

export default Card;
