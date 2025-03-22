import React from 'react';
import styles from './Controls.module.css';

interface ControlsProps {
  selectedRegion: string;
  onRegionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (key: 'name' | 'population', order: 'asc' | 'desc') => void;
}

function Controls({
  selectedRegion,
  onRegionChange,
  searchQuery,
  onSearchChange,
  onSortChange,
}: ControlsProps) {
  return (
    <div className={styles.controls}>
      <div className={styles.controls__region}>
        <label htmlFor="region">Filter by Region:</label>
        <select
          className={styles.controls__select}
          id="region"
          value={selectedRegion}
          onChange={onRegionChange}
        >
          <option value="">All</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>
      </div>

      <div className={styles.controls__name}>
        <label htmlFor="search">Search by Name:</label>
        <input
          className={styles.inputName}
          type="text"
          id="search"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Enter country name"
        />
      </div>

      <div className={styles.sortingButtons}>
        <label>Sort by:</label>
        <button onClick={() => onSortChange('name', 'asc')}>Name Asc</button>
        <button onClick={() => onSortChange('name', 'desc')}>Name Desc</button>
        <button onClick={() => onSortChange('population', 'asc')}>
          Population Asc
        </button>
        <button onClick={() => onSortChange('population', 'desc')}>
          Population Desc
        </button>
      </div>
    </div>
  );
}

const MemoizedControls = React.memo(Controls);
MemoizedControls.displayName = 'Controls';

export default MemoizedControls;
