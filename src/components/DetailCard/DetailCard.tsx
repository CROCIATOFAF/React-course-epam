import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import styles from './DetailCard.module.css';

interface CardDetail {
  id: string;
  title: string;
  description: string;
  image?: string;
}

const DetailCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<CardDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`https://images-api.nasa.gov/search?nasa_id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (
          data &&
          data.collection &&
          data.collection.items &&
          data.collection.items.length > 0
        ) {
          const item = data.collection.items[0];
          const dataItem = item.data && item.data[0];
          setDetail({
            id: dataItem.nasa_id,
            title: dataItem.title,
            description: dataItem.description || 'No description available',
            image: `https://images-assets.nasa.gov/image/${dataItem.nasa_id}/${dataItem.nasa_id}~thumb.jpg`,
          });
        } else {
          setDetail(null);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching detail:', error);
        setLoading(false);
      });
  }, [id]);

  const handleClose = () => {
    const frontpage = searchParams.get('frontpage');
    navigate(frontpage ? `/?frontpage=${frontpage}` : '/');
  };

  if (loading) return <Spinner />;
  if (!detail) return <p>No details available.</p>;

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

      {/* Render Title and Description */}
      <h3>{detail.title}</h3>
      <h4>Description:</h4>
      <p>{detail.description}</p>
    </div>
  );
};

export default DetailCard;
