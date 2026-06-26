export const LoadingState = ({ text = 'Loading...' }) => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center text-gray-600 dark:text-gray-300">
    {text}
  </div>
);

export const EmptyState = ({ title = 'No data found', description = 'There is nothing to show yet.' }) => (
  <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

export const ErrorState = ({ message = 'Something went wrong', onRetry }) => (
  <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-6 text-center">
    <p className="text-sm font-semibold text-red-700 dark:text-red-300">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">
        Retry
      </button>
    )}
  </div>
);
