import React, { useMemo } from 'react';
import { Country } from '../../types';
import CountryCard from '../CountryCard/CountryCard';
import styles from './FilteredCountries.module.css';

interface FilteredCountriesProps {
  countries: Country[];
  selectedRegion: string;
  searchQuery: string;
  sortKey: 'name' | 'population' | '';
  sortOrder: 'asc' | 'desc';
  visitedCountries: string[];
  onCountryVisit: (countryName: string) => void;
}

const FilteredCountries: React.FC<FilteredCountriesProps> = ({
  countries,
  selectedRegion,
  searchQuery,
  sortKey,
  sortOrder,
  visitedCountries,
  onCountryVisit,
}) => {
  const processedCountries = useMemo(() => {
    let filtered = [...countries];

    if (selectedRegion) {
      filtered = filtered.filter(
        (country) => country.region === selectedRegion
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((country) =>
        country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortKey) {
      filtered.sort((a, b) => {
        if (sortKey === 'name') {
          return sortOrder === 'asc'
            ? a.name.common.localeCompare(b.name.common)
            : b.name.common.localeCompare(a.name.common);
        } else {
          return sortOrder === 'asc'
            ? a.population - b.population
            : b.population - a.population;
        }
      });
    }

    return filtered;
  }, [countries, selectedRegion, searchQuery, sortKey, sortOrder]);

  return (
    <div className={styles.filteredCountries}>
      {processedCountries.map((country) => (
        <CountryCard
          key={country.name.common}
          country={country}
          isVisited={visitedCountries.includes(country.name.common)}
          onVisit={onCountryVisit}
        />
      ))}
    </div>
  );
};

export default FilteredCountries;
