import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/apiClient';
import { getMessage } from '../../utils/apiResponse';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Mail,
    MailOpen,
    CheckCircle2,
    Trash2,
    Send,
    MessageSquare,
    Search,
    RefreshCw,
    Clock,
    User,
    AtSign
} from 'lucide-react';

const FounderContactMessages = () => {
    const { isDark } = useTheme();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'resolved'
    const [searchTerm, setSearchTerm] = useState('');

    // Selected message for detail view / reply drawer
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sendingReply, setSendingReply] = useState(false);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/founder/contact/message');
            const data = res.data.data;
            setMessages(Array.isArray(data) ? data : data?.messages || []);
        } catch (error) {
            showToast(getMessage(error, "Failed to load contact messages."), "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // Handle Reply & Resolve
    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) {
            showToast("Please enter a reply message.", "error");
            return;
        }

        try {
            setSendingReply(true);
            // Assuming you post to reply or patch message status
            await apiClient.post(`/contact/message/${selectedMessage._id}/reply`, {
                message: replyText.trim()
            });

            showToast("Reply sent and marked as resolved!", "success");
            setReplyText('');
            setSelectedMessage(null);
            fetchMessages();
        } catch (error) {
            showToast(getMessage(error, "Failed to send reply."), "error");
        } finally {
            setSendingReply(false);
        }
    };

    // Handle Delete Message
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;

        try {
            await apiClient.delete(`/contact/message/${id}`);
            showToast("Message deleted successfully.", "success");
            if (selectedMessage?._id === id) setSelectedMessage(null);
            fetchMessages();
        } catch (error) {
            showToast(getMessage(error, "Failed to delete message."), "error");
        }
    };

    // Filter messages
    const filteredMessages = messages.filter((item) => {
        const matchesSearch =
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.message?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Dynamic styling variables
    const containerBg = isDark ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-gray-900';
    const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200';
    const inputBg = isDark ? 'bg-zinc-900/50 border-zinc-700 text-white placeholder-zinc-500 focus:border-green-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-600';
    const subText = isDark ? 'text-zinc-400' : 'text-gray-500';

    return (
        <div className={`min-h-screen p-6 md:p-10 ${containerBg}`}>
            <div className="max-w-6xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className={`group inline-flex items-center gap-2 text-sm transition-colors mb-6 rounded-full px-3 py-1.5 ${isDark
                        ? "bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 ring-1 ring-white/10"
                        : "bg-white/70 hover:bg-white text-zinc-600 ring-1 ring-zinc-900/5 shadow-sm"
                        }`}
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-500/10 text-green-500 rounded-2xl">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Support & Contact Messages</h1>
                            <p className={`text-sm mt-0.5 ${subText}`}>
                                Review inquiries sent by users, reply directly, and manage support tickets.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={fetchMessages}
                        className={`self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors shadow-sm ${isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-200' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>

                {/* Filters & Search Toolbar */}
                <div className={`border rounded-2xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center ${cardBg}`}>
                    <div className="relative w-full sm:w-80">
                        <input
                            type="text"
                            placeholder="Search by name, email, or content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 text-sm rounded-xl border outline-none transition-all ${inputBg}`}
                        />
                        <Search className="absolute left-3 top-2.5 text-zinc-400 w-4 h-4" />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {['all', 'pending', 'resolved'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${filterStatus === status
                                    ? 'bg-green-600 text-white border-green-600 shadow-sm shadow-green-600/25'
                                    : isDark
                                        ? 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Layout Grid (List on Left, Details/Reply on Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Messages List */}
                    <div className={`lg:col-span-5 border rounded-2xl shadow-sm overflow-hidden flex flex-col h-[650px] ${cardBg}`}>
                        <div className={`p-4 border-b text-xs font-semibold uppercase tracking-wider ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-gray-100 text-gray-500'}`}>
                            Inbox ({filteredMessages.length})
                        </div>

                        <div className="overflow-y-auto flex-1 divide-y divide-inherit">
                            {loading ? (
                                <div className="p-8 text-center text-zinc-400 text-sm">Loading messages...</div>
                            ) : filteredMessages.length === 0 ? (
                                <div className="p-12 text-center text-zinc-400 text-sm flex flex-col items-center justify-center gap-2">
                                    <MailOpen className="w-8 h-8 opacity-40" />
                                    <p>No messages found matching your criteria.</p>
                                </div>
                            ) : (
                                filteredMessages.map((item) => {
                                    const isSelected = selectedMessage?._id === item._id;
                                    const isResolved = item.status === 'resolved';

                                    return (
                                        <div
                                            key={item._id}
                                            onClick={() => setSelectedMessage(item)}
                                            className={`p-4 cursor-pointer transition-all border-l-4 ${isSelected
                                                ? 'bg-green-500/10 border-green-500'
                                                : isDark
                                                    ? 'hover:bg-zinc-800/50 border-transparent'
                                                    : 'hover:bg-gray-50 border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <span className="text-sm font-semibold truncate">{item.name || 'Anonymous'}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-medium ${isResolved
                                                    ? 'bg-emerald-500/10 text-emerald-500'
                                                    : 'bg-amber-500/10 text-amber-500'
                                                    }`}>
                                                    {item.status || 'pending'}
                                                </span>
                                            </div>
                                            <p className={`text-xs font-medium truncate mb-1 ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                                                {item.subject || 'No Subject'}
                                            </p>
                                            <p className={`text-xs truncate ${subText}`}>
                                                {item.message}
                                            </p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Message Detail & Reply Box */}
                    <div className={`lg:col-span-7 border rounded-2xl shadow-sm p-6 flex flex-col justify-between h-[650px] ${cardBg}`}>
                        {selectedMessage ? (
                            <div className="flex flex-col h-full overflow-hidden">

                                {/* Header Info */}
                                <div className="pb-4 border-b border-inherit mb-4 flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold mb-1">{selectedMessage.subject || 'Support Inquiry'}</h2>
                                        <div className="flex items-center gap-4 text-xs text-zinc-400">
                                            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {selectedMessage.name}</span>
                                            <span className="flex items-center gap-1.5"><AtSign className="w-3.5 h-3.5" /> {selectedMessage.email}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(selectedMessage._id)}
                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                                        title="Delete Message"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Message Body Scrollable */}
                                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                    <div className={`p-4 rounded-xl text-sm leading-relaxed ${isDark ? 'bg-zinc-950/60' : 'bg-gray-50'}`}>
                                        <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                                        <span className="block text-[10px] text-zinc-500 mt-3">
                                            Received: {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : 'N/A'}
                                        </span>
                                    </div>

                                    {/* If already replied, show previous resolution info */}
                                    {selectedMessage.reply && (
                                        <div className="p-4 rounded-xl text-sm bg-green-500/5 border border-green-500/20">
                                            <p className="text-xs font-semibold text-green-500 mb-1">Founder Reply Sent:</p>
                                            <p className={`text-xs ${subText}`}>{selectedMessage.reply}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Reply Form */}
                                <form onSubmit={handleSendReply} className="pt-4 border-t border-inherit mt-4">
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                                        Reply & Resolve
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            required
                                            placeholder="Type your response to the user..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className={`flex-1 px-4 py-2.5 text-sm rounded-xl border outline-none transition-all ${inputBg}`}
                                        />
                                        <button
                                            type="submit"
                                            disabled={sendingReply}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-medium text-sm rounded-xl transition-all shadow-sm shadow-green-600/20 disabled:opacity-50"
                                        >
                                            <Send className="w-4 h-4" /> Send
                                        </button>
                                    </div>
                                </form>

                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400">
                                <div className={`p-4 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-gray-100'} mb-3`}>
                                    <Mail className="w-8 h-8 opacity-40" />
                                </div>
                                <p className="text-sm font-medium">Select a message from the inbox</p>
                                <p className="text-xs mt-1 text-zinc-500 max-w-xs">
                                    Click on any contact inquiry on the left to read full details and send a direct reply.
                                </p>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default FounderContactMessages;