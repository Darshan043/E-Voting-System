import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry, onDismiss }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
      <div className="flex items-center mb-4">
        <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
        <h3 className="text-lg font-medium text-red-800">
          Something went wrong
        </h3>
      </div>
      
      <p className="text-red-700 mb-6">
        {error}
      </p>
      
      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;