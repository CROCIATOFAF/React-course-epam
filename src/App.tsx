import React, { useEffect, useState, useCallback, Profiler } from 'react';
import Controls from './components/Controls/Controls';
import FilteredCountries from './components/FilteredCountries/FilteredCountries';
import { Country } from './types';
import './App.css';

const onRenderCallback = ((...args: unknown[]): void => {
  console.log('Profiler onRender arguments:', args);
}) as unknown as React.ProfilerOnRenderCallback;

const App: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortKey, setSortKey] = useState<'name' | 'population' | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((res) => res.json())
      .then((data: Country[]) => setCountries(data))
      .catch((err: unknown) => console.error('Error fetching countries:', err));
  }, []);

  const handleRegionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedRegion(e.target.value);
    },
    []
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleSortChange = useCallback(
    (key: 'name' | 'population', order: 'asc' | 'desc') => {
      setSortKey(key);
      setSortOrder(order);
    },
    []
  );

  const visitedCountries = JSON.parse(
    localStorage.getItem('visited') || '[]'
  ) as string[];

  return (
    <div className="App">
      <h1>Country Explorer</h1>
      <Controls
        selectedRegion={selectedRegion}
        onRegionChange={handleRegionChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
      />
      <Profiler id="CountryList" onRender={onRenderCallback}>
        <div className="countries-list">
          <FilteredCountries
            countries={countries}
            selectedRegion={selectedRegion}
            searchQuery={searchQuery}
            sortKey={sortKey}
            sortOrder={sortOrder}
            visitedCountries={visitedCountries}
          />
        </div>
      </Profiler>
    </div>
  );
};

export default App;
