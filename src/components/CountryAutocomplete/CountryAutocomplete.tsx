import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styles from './CountryAutocomplete.module.css';

interface CountryAutocompleteProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const CountryAutocomplete: React.FC<CountryAutocompleteProps> = ({
  id,
  // label,
  value,
  onChange,
}) => {
  const countries = useSelector((state: RootState) => state.forms.countries);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = countries.filter(
      (country) => country !== '----------------'
    );
    if (value.trim() === '') {
      setSuggestions(filtered);
    } else {
      const lower = value.toLowerCase();
      setSuggestions(
        filtered.filter((country) => country.toLowerCase().includes(lower))
      );
    }
  }, [value, countries]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={styles.autocompleteContainer}>
      {/* <label htmlFor={id} className={styles.label}>
        {label}:
      </label> */}
      <input
        id={id}
        type="text"
        className={styles.autocompleteInput}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((country, idx) => (
            <li
              key={idx}
              className={styles.suggestionItem}
              onClick={() => {
                onChange(country);
                setShowSuggestions(false);
              }}
            >
              {country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountryAutocomplete;
