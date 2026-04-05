import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 mb-4">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Something went wrong</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-sm">
            {this.props.message || 'This section encountered an error. Your data is safe.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            <RefreshCw size={14} /> Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
