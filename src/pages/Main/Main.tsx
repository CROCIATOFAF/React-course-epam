import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useLocation } from 'react-router-dom';
import type { FormData } from '../../types';
// import styles from './Main.module.css';

interface LocationState {
  newEntryId?: string;
}

const Main: React.FC = () => {
  const location = useLocation() as LocationState;
  const newEntryId = location.newEntryId;

  const entries = useSelector((state: RootState) => state.forms.entries);
  const [highlightId, setHighlightId] = useState<string | undefined>(
    newEntryId
  );

  useEffect(() => {
    if (newEntryId) {
      const timer = setTimeout(() => {
        setHighlightId(undefined);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [newEntryId]);

  return (
    <div>
      <h1>React Forms - Main Page</h1>
      {entries.map((entry: FormData) => (
        <div
          key={entry.id}
          style={{
            border:
              highlightId === entry.id ? '2px solid red' : '1px solid black',
            marginBottom: '1rem',
            padding: '1rem',
          }}
        >
          <p>
            <strong>Name:</strong> {entry.name}
          </p>
          <p>
            <strong>Age:</strong> {entry.age}
          </p>
          <p>
            <strong>Email:</strong> {entry.email}
          </p>
          <p>
            <strong>Gender:</strong> {entry.gender}
          </p>
          <p>
            <strong>Country:</strong> {entry.country}
          </p>
          <p>
            <strong>Image:</strong>{' '}
            {entry.image && (
              <img src={entry.image} alt="uploaded" width={100} />
            )}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Main;
