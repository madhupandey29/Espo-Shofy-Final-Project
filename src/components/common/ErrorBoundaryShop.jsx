'use client';
import React from 'react';

class ErrorBoundaryShop extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Shop page error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="shop-error-fallback">
          <div className="error-content">
            <h2>Something went wrong with the shop page</h2>
            <p>We're working to fix this issue. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Refresh Page
            </button>
          </div>
          
          <style jsx>{`
            .shop-error-fallback {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 400px;
              padding: 40px 20px;
              text-align: center;
            }
            
            .error-content h2 {
              color: var(--tp-text-1);
              margin-bottom: 16px;
              font-family: var(--tp-ff-jost);
            }
            
            .error-content p {
              color: var(--tp-text-2);
              margin-bottom: 24px;
              font-family: var(--tp-ff-roboto);
            }
            
            .retry-button {
              background: var(--tp-theme-primary);
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              cursor: pointer;
              font-family: var(--tp-ff-roboto);
              font-weight: 600;
              transition: background 0.3s ease;
            }
            
            .retry-button:hover {
              background: color-mix(in srgb, var(--tp-theme-primary) 90%, black);
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryShop;