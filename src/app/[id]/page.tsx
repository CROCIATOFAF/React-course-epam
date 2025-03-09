import React, { Suspense, lazy } from 'react';
import type { GetServerSideProps } from 'next';
import Spinner from '../../components/Spinner/Spinner';

const DetailCard = lazy(() => import('../../components/DetailCard/DetailCard'));

interface DetailPageProps {
  id: string;
}

const DetailPage: React.FC<DetailPageProps> = ({ id }) => {
  return (
    <Suspense fallback={<Spinner />}>
      <DetailCard id={id} />
    </Suspense>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  return { props: { id } };
};

export default DetailPage;
