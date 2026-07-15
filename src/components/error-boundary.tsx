'use client';

import React, { Component, type ReactNode } from 'react';

type FallbackFn = (props: { error: Error; reset: () => void }) => ReactNode;

interface Props {
  children: ReactNode;
  fallback?: FallbackFn | ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  error: Error | null;
}

/**
 * ErrorBoundary — catches thrown errors from children and renders a fallback UI
 * instead of crashing the whole app.
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<p>Something went wrong</p>}>
 *   <FirebaseErrorListener />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback({
          error: this.state.error,
          reset: this.handleReset,
        });
      }
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}
