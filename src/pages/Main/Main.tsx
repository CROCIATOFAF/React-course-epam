import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { FormData } from '../../types';
import { RootState } from '../../store/store';
import { clearHighlightedEntry } from '../../store/formsSlice';
import styles from './Main.module.css';

const Main: React.FC = () => {
  const highlightedEntryId = useSelector(
    (state: RootState) => state.forms.highlightedEntryId
  );

  const entries = useSelector((state: RootState) => state.forms.entries);
  const dispatch = useDispatch();
  const [localHighlightId, setLocalHighlightId] = useState<string | undefined>(
    highlightedEntryId || undefined
  );

  useEffect(() => {
    if (highlightedEntryId) {
      setLocalHighlightId(highlightedEntryId);
      const timer = setTimeout(() => {
        dispatch(clearHighlightedEntry());
        setLocalHighlightId(undefined);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightedEntryId, dispatch]);

  return (
    <div className={styles.mainContainer}>
      <h1>React Forms - Main Page</h1>
      {entries.map((entry: FormData) => (
        <div
          key={entry.id}
          className={`${styles.card} ${
            localHighlightId === entry.id ? styles.highlight : ''
          }`}
        >
          <div className={styles.fieldLabel}>Name:</div>
          <div className={styles.fieldValue}>{entry.name}</div>

          <div className={styles.fieldLabel}>Age:</div>
          <div className={styles.fieldValue}>{entry.age}</div>

          <div className={styles.fieldLabel}>Email:</div>
          <div className={styles.fieldValue}>{entry.email}</div>

          <div className={styles.fieldLabel}>Gender:</div>
          <div className={styles.fieldValue}>{entry.gender}</div>

          <div className={styles.fieldLabel}>Country:</div>
          <div className={styles.fieldValue}>{entry.country}</div>

          <div className={styles.fieldLabel}>Image:</div>
          <div className={styles.fieldValue}>
            {entry.image && (
              <img src={entry.image} alt="uploaded" width={100} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Main;
