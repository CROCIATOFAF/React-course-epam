import React, { Suspense } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DetailPage, { getServerSideProps } from '../pages/details/[id]';
import '@testing-library/jest-dom';
import { GetServerSidePropsContext } from 'next';

jest.mock('../components/Spinner/Spinner', () => {
  return function SpinnerMock() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

jest.mock('../components/DetailCard/DetailCard', () => {
  return function DetailCardMock() {
    return <div data-testid="detail-card">Detail Card Content</div>;
  };
});

describe('DetailPage Component', () => {
  it('renders DetailCard inside Suspense', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <DetailPage id="123" />
      </Suspense>
    );

    await waitFor(() =>
      expect(screen.getByTestId('detail-card')).toBeInTheDocument()
    );
  });

  it('renders Spinner while loading', async () => {
    const LazyDetailCard = React.lazy(() => new Promise(() => {}));

    render(
      <Suspense fallback={<div data-testid="spinner">Loading...</div>}>
        <LazyDetailCard />
      </Suspense>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});

describe('getServerSideProps', () => {
  it('returns correct props', async () => {
    const context = {
      params: { id: '123' },
    } as unknown as GetServerSidePropsContext;

    const response = await getServerSideProps(context);

    expect(response).toEqual({
      props: { id: '123' },
    });
  });
});
