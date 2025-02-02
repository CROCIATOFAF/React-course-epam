import { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';
interface ErrorBoundaryProps {
  children: ReactNode;
}
let a;

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    void error;
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.fallbackContainer}>
          <img className={styles.errorIcon} src="/error.svg" alt="error icon" />
          <h1>Oops! Something went wrong.</h1>
          <p>
            Sun is very active today, or Saturn is in Scorpio... Yet Again!!!
            Please try again.
          </p>
          <button onClick={this.handleReset} className={styles.retryButton}>
            Retry, Please
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
