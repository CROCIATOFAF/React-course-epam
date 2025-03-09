import React from 'react';
import { render, screen } from '@testing-library/react';
import DetailPage, { getServerSideProps } from '../pages/details/[id]';
import '@testing-library/jest-dom';
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
    render(<DetailPage id="123" />);

    expect(screen.getByTestId('detail-card')).toBeInTheDocument();
  });

  it('renders Spinner when loading', async () => {
    render(<DetailPage id="123" />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});

describe('getServerSideProps', () => {
  it('returns correct props', async () => {
    const context = { params: { id: '123' } } as any;

    const response = await getServerSideProps(context);

    expect(response).toEqual({
      props: { id: '123' },
    });
  });
});
