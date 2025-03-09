import React, { useState } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

class ProblemChild extends React.Component {
  componentDidMount() {
    throw new Error('Test error');
  }
  render() {
    return <div>Problem Child</div>;
  }
}

describe('ErrorBoundary Component', () => {
  test('renders fallback UI when a child component throws an error', async () => {
    await act(async () => {
      render(
        <ErrorBoundary>
          <ProblemChild />
        </ErrorBoundary>
      );
    });

    expect(screen.getByText('Oops! Something went wrong.')).toBeInTheDocument();
  });

  test('resets error state when reset is triggered', async () => {
    const ThrowButton = () => {
      const [throwError, setThrowError] = useState(false);
      return (
        <div>
          {throwError ? (
            <ProblemChild />
          ) : (
            <button onClick={() => setThrowError(true)}>Throw</button>
          )}
        </div>
      );
    };

    await act(async () => {
      render(
        <ErrorBoundary>
          <ThrowButton />
        </ErrorBoundary>
      );
    });

    fireEvent.click(screen.getByText('Throw'));

    expect(screen.getByText('Oops! Something went wrong.')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Retry, Please'));

    expect(
      screen.queryByText('Oops! Something went wrong.')
    ).not.toBeInTheDocument();
  });
});
