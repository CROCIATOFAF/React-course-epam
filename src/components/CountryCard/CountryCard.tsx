import React from 'react';
import { Country } from '../../types';
import styles from './CountryCard.module.css';

interface CountryCardProps {
  country: Country;
  isVisited: boolean;
  onVisit: (countryName: string) => void;
}

function CountryCard({ country, isVisited, onVisit }: CountryCardProps) {
  const handleClick = () => {
    onVisit(country.name.common);
  };

  return (
    <div
      className={`${styles.countryCard} ${isVisited ? styles.visited : ''}`}
      onClick={handleClick}
    >
      <img
        className={styles.flag}
        src={country.flags.png}
        alt={`${country.name.common} flag`}
      />
      <h3>{country.name.common}</h3>
      <p>Population: {country.population.toLocaleString()}</p>
      <p>Region: {country.region}</p>
    </div>
  );
}

const MemoizedCountryCard = React.memo(CountryCard);
MemoizedCountryCard.displayName = 'CountryCard';

export default MemoizedCountryCard;
