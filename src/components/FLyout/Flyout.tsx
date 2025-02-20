import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, unselectAll } from '../../store';
import { selectSelectedItems } from '../../store';
import styles from './Flyout.module.css';

const Flyout: React.FC = () => {
  const dispatch = useDispatch();
  const selectedItems = useSelector((state: RootState) =>
    selectSelectedItems(state)
  );

  if (selectedItems.length === 0) return null;

  const handleDownload = () => {
    const header = ['Title', 'Description', 'Image'];
    const rows = selectedItems.map((item) => [
      item.title,
      item.description,
      item.image || '',
    ]);
    const csvContent = [header, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedItems.length}_items.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.flyout}>
      <p>
        {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''}{' '}
        selected
      </p>
      <button onClick={() => dispatch(unselectAll())}>Unselect all</button>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};

export default Flyout;
