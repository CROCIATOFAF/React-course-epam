'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Spinner from '../Spinner/Spinner';
import styles from './DetailCard.module.css';
import { useFetchDetailQuery } from '../services/api';

interface CardDetail {
  id: string;
  title: string;
  description: string;
  image?: string;
}

interface DetailCardProps {
  id?: string;
  onClose?: () => void;
}

const DetailCard: React.FC<DetailCardProps> = ({ id: propId, onClose }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = propId || searchParams.get('id') || '';

  console.log('DetailCard ID:', id);
  const { data, error, isLoading } = useFetchDetailQuery(id);
  console.log('API Response:', data);
  console.log('Error:', error);
  console.log('Is Loading:', isLoading);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      const frontpage = searchParams.get('frontpage');
      router.push(frontpage ? `/?frontpage=${frontpage}` : '/');
    }
  };

  if (isLoading) return <Spinner />;
  if (
    error ||
    !data ||
    !data.collection.items ||
    data.collection.items.length === 0
  ) {
    return <p>No details available.</p>;
  }

  const item = data.collection.items[0];
  const dataItem = item.data && item.data[0];

  if (!dataItem) {
    return <p>No details available.</p>;
  }

  const detail: CardDetail = {
    id: dataItem.nasa_id,
    title: dataItem.title,
    description: dataItem.description || 'No description available',
    image:
      item.links?.[0]?.href ||
      `https://images-assets.nasa.gov/image/${dataItem.nasa_id}/${dataItem.nasa_id}~thumb.jpg`,
  };

  return (
    <div className={styles.detailCard}>
      <button onClick={handleClose} className={styles['close-button']}>
        Close
      </button>
      {detail.image ? (
        <img src={detail.image} alt={detail.title} className="card-image" />
      ) : (
        <div className="card-placeholder">No Image Available</div>
      )}
      <h3>{detail.title}</h3>
      <h4>Description:</h4>
      <p>{detail.description}</p>
    </div>
  );
};

export default DetailCard;
