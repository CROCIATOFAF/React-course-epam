import React, { useContext } from 'react';
import { ThemeContext, Theme } from '../../context/ThemeContext';
import styles from './ThemeSwitcher.module.css';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as Theme);
  };

  return (
    <div className={styles.themeSwitcher}>
      <label htmlFor="theme-select">Select Theme: </label>
      <select id="theme-select" value={theme} onChange={handleChange}>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
  );
};

export default ThemeSwitcher;
