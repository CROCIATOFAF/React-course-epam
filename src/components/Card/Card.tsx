import React from 'react';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  title: string;
  description: string;
  image?: string;
  onClick: (id: string, e: React.MouseEvent) => void;
  isSelected: boolean;
  onSelectChange: (id: string, selected: boolean) => void;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  description,
  image,
  onClick,
  isSelected,
  onSelectChange,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent) => {
    onClick(id, e);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectChange(id, e.target.checked);
  };

  return (
    <div className={styles.card} onClick={handleClick} {...rest}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleCheckboxChange}
        onClick={(e) => e.stopPropagation()}
      />
      {image ? (
        <img src={image} alt={title} className={styles.image} />
      ) : (
        <div className={styles.placeholder}>No Image Available</div>
      )}
      <h3>{title}</h3>
      <h4>Description:</h4>
      <p>{description}</p>
    </div>
  );
};

export default Card;
