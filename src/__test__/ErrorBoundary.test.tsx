import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

function ProblemChild() {
  throw new Error('Test error');
}

function NormalChild() {
  return <div data-testid="child">Child Content</div>;
}

interface ControlledWrapperProps {
  shouldThrow: boolean;
  resetKey: string;
}
function ControlledWrapper({ shouldThrow, resetKey }: ControlledWrapperProps) {
  return (
    <ErrorBoundary key={resetKey}>
      {shouldThrow ? <ProblemChild /> : <NormalChild />}
    </ErrorBoundary>
  );
}

describe('ErrorBoundary Component', () => {
  afterEach(cleanup);

  it('renders fallback UI when a child component throws an error', () => {
    render(<ControlledWrapper shouldThrow={true} resetKey="1" />);
    expect(screen.getByText(/Oops! Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/Please try again/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Retry, Please/i })
    ).toBeInTheDocument();
  });

  it('resets error state and renders children when reset is triggered', async () => {
    const { rerender } = render(
      <ControlledWrapper shouldThrow={true} resetKey="1" />
    );
    expect(screen.getByText(/Oops! Something went wrong/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Retry, Please/i }));

    rerender(<ControlledWrapper shouldThrow={false} resetKey="2" />);
    await waitFor(() => {
      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
  });
});
