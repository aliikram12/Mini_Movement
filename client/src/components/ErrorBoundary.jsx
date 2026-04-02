import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cream-light p-4">
          <div className="bg-white rounded-2xl shadow-soft p-8 max-w-md w-full border border-red-100">
            <h1 className="text-xl font-bold text-red-500 mb-4">Something went wrong!</h1>
            <p className="text-sm text-brand-medium mb-4">{this.state.error?.message || 'An unexpected error occurred in rendering.'}</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full py-3 bg-brand-warm text-white rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
