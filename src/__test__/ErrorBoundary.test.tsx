import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

function ProblemChild() {
  throw new Error('Test error');
}

function ControlledChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div data-testid="child">Child Content</div>;
}

function Wrapper() {
  const [throwError, setThrowError] = useState(true);
  const [boundaryKey, setBoundaryKey] = useState(0);

  return (
    <div>
      <button
        onClick={() => {
          setThrowError(false);
          setBoundaryKey((prev) => prev + 1);
        }}
      >
        Toggle
      </button>
      <ErrorBoundary key={boundaryKey}>
        <ControlledChild shouldThrow={throwError} />
      </ErrorBoundary>
    </div>
  );
}

describe('ErrorBoundary Component', () => {
  it('renders fallback UI when a child component throws an error', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(screen.getByText('Oops! Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('Retry, Please')).toBeInTheDocument();
  });

  it('resets error state and renders children when reset is triggered', async () => {
    const { getByText, getByTestId } = render(<Wrapper />);

    expect(getByText('Oops! Something went wrong.')).toBeInTheDocument();
    expect(getByText('Retry, Please')).toBeInTheDocument();

    fireEvent.click(getByText('Retry, Please'));
    fireEvent.click(getByText('Toggle'));

    await waitFor(() => {
      expect(getByTestId('child')).toBeInTheDocument();
      expect(getByText('Child Content')).toBeInTheDocument();
    });
  });
});
