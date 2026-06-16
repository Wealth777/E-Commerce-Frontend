import { useEffect, useState } from 'react';
import { vendorFeedbackAPI } from '../../services/feedback.service';
import { getList, getMessage } from '../../utils/apiResponse';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { EmptyState, ErrorState, LoadingState, ReportCard, ReportForm } from '../../components/feedback';

const VendorReports = () => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '', status: '', priority: '', targetType: '', sortBy: 'createdAt', sortOrder: 'desc' });

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ''));
      const res = await vendorFeedbackAPI.getMyReports(params);
      setReports(getList(res, ['reports', 'data', 'items']));
    } catch (err) {
      setError(getMessage(err, 'Failed to load reports'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReports(); }, [filters.page, filters.status, filters.priority, filters.targetType]);

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));

  const createReport = async (data) => {
    setSaving(true);
    try {
      await vendorFeedbackAPI.createReport(data);
      showToast('Report submitted', 'success');
      setShowForm(false);
      loadReports();
    } catch (err) {
      showToast(getMessage(err, 'Failed to submit report'), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-4 md:p-8`}>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black">Vendor Reports</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create and track reports from your vendor account.</p>
          </div>
          <button onClick={() => setShowForm((value) => !value)} className="rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white">{showForm ? 'Close form' : 'Create report'}</button>
        </div>

        {showForm && <ReportForm onSubmit={createReport} onCancel={() => setShowForm(false)} loading={saving} />}

        <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-wrap gap-3">
            <input value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loadReports()} placeholder="Search reports" className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
            <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
              <option value="">All status</option><option value="pending">pending</option><option value="under_review">under_review</option><option value="resolved">resolved</option><option value="rejected">rejected</option>
            </select>
            <select value={filters.priority} onChange={(e) => updateFilter('priority', e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
              <option value="">All priority</option><option value="low">low</option><option value="medium">medium</option><option value="high">high</option><option value="critical">critical</option>
            </select>
            <select value={filters.targetType} onChange={(e) => updateFilter('targetType', e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
              <option value="">All targets</option><option value="product">product</option><option value="review">review</option><option value="vendor">vendor</option><option value="buyer">buyer</option><option value="user">user</option><option value="order">order</option>
            </select>
          </div>
        </div>

        {loading ? <LoadingState text="Loading reports..." /> : error ? <ErrorState message={error} onRetry={loadReports} /> : reports.length === 0 ? <EmptyState title="No reports yet" description="Reports you submit will appear here." /> : (
          <div className="space-y-4">{reports.map((report) => <ReportCard key={report._id || report.id} report={report} />)}</div>
        )}
      </div>
    </div>
  );
};

export default VendorReports;
