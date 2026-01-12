/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */

import { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Wraps components to catch and handle errors gracefully
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen washi-bg flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-washi border border-shu-200 p-8 max-w-md w-full text-center">
            <div className="p-4 bg-shu-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-shu-DEFAULT" />
            </div>

            <h2 className="text-2xl font-bold text-sumi-900 mb-3">
              出错了
            </h2>

            <p className="text-sumi-600 mb-6">
              {this.state.error?.message || '应用遇到了意外错误，请刷新页面重试'}
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-ai-DEFAULT hover:bg-ai-600 text-white font-semibold rounded-2xl transition-all duration-200"
              >
                <RefreshCw size={20} />
                重试
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-6 py-3 bg-sumi-50 hover:bg-sumi-100 text-sumi-700 font-semibold rounded-2xl transition-all duration-200"
              >
                返回首页
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm font-medium text-sumi-400 cursor-pointer">
                  错误详情（开发模式）
                </summary>
                <pre className="mt-3 p-4 bg-sumi-100 rounded-xl text-xs overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC for wrapping components with Error Boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
