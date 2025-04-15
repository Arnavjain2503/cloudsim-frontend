import React from 'react';
import { Alert } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="danger" className="mt-4 text-center">
          <h4>⚠️ Something went wrong while rendering results.</h4>
          <p>{this.state.error?.message}</p>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
