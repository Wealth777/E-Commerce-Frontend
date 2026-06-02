const ReportCard = ({ report }) => (
  <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/40 dark:text-green-300">{report?.targetType || 'target'}</span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">{report?.status || 'pending'}</span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">{report?.priority || 'medium'}</span>
        </div>
        <h3 className="mt-3 font-bold text-gray-900 dark:text-white">{report?.reason || 'Report'}</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{report?.description || 'No description provided'}</p>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Target ID: {report?.targetId || report?.target?._id || 'N/A'}
          {report?.createdAt && ` · ${new Date(report.createdAt).toLocaleDateString()}`}
        </p>
      </div>
    </div>
  </div>
);

export default ReportCard;
