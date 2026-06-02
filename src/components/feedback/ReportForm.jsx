import { useState } from 'react';

const TARGET_TYPES = ['product', 'review', 'vendor', 'buyer', 'user', 'order'];
const PRIORITIES = ['low', 'medium', 'high', 'critical'];

const ReportForm = ({ initialData = {}, onSubmit, onCancel, loading = false }) => {
  const [targetType, setTargetType] = useState(initialData.targetType || 'product');
  const [targetId, setTargetId] = useState(initialData.targetId || '');
  const [reason, setReason] = useState(initialData.reason || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [priority, setPriority] = useState(initialData.priority || 'medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetType || !targetId.trim() || !reason.trim()) return;
    onSubmit?.({ targetType, targetId: targetId.trim(), reason: reason.trim(), description: description.trim(), priority });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">Target type</label>
          <select value={targetType} onChange={(e) => setTargetType(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
            {TARGET_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">Target ID</label>
          <input value={targetId} onChange={(e) => setTargetId(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white" placeholder="Paste target ID" />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">Reason</label>
        <input value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white" placeholder="Why are you reporting this?" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white" placeholder="Add helpful details" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
          {PRIORITIES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <div className="flex flex-wrap gap-3">
        <button disabled={loading || !targetId.trim() || !reason.trim()} className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60">
          {loading ? 'Submitting...' : 'Submit report'}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 dark:border-gray-700 dark:text-gray-200">Cancel</button>}
      </div>
    </form>
  );
};

export default ReportForm;
