import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Archive,
  ArrowLeft,
  Ban,
  Check,
  CheckCheck,
  FileText,
  Image as ImageIcon,
  Loader2,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  ShieldAlert,
  Trash2,
  X,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import useChatSocket, {
  emitMessageRead,
  emitTypingStart,
  emitTypingStop,
} from '../../hooks/useChatSocket';
import {
  archiveConversation,
  blockChatUser,
  deleteConversation,
  fetchConversations,
  fetchMessages,
  markConversationRead,
  reportConversation,
  sendChatMessage,
  startConversation,
  setActiveConversation,
  unarchiveConversation,
  unblockChatUser,
} from '../../store/chatSlice';
import {
  getChatId,
  getInitials,
  getMessageSenderId,
  getOtherParticipant,
  getParticipantAvatar,
  getParticipantDisplayName,
  getParticipantIds,
  getParticipantRole,
  isParticipantOnline,
} from '../../utils/chatIdentity';

const getConversationId = (conversation) =>
  conversation?._id ||
  conversation?.id ||
  conversation?.conversationId ||
  '';

const getMessageId = (message) =>
  message?._id ||
  message?.id ||
  message?.messageId ||
  `${getMessageSenderId(message)}-${message?.createdAt || ''}`;

const formatTime = (date) => {
  if (!date) return '';

  try {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

const formatDate = (date) => {
  if (!date) return '';

  try {
    return new Date(date).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

const SkeletonList = () => (
  <div className="space-y-3 p-4">
    {[1, 2, 3, 4, 5].map((item) => (
      <div
        key={item}
        className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"
      />
    ))}
  </div>
);

const EmptyState = ({ title, text }) => (
  <div className="flex h-full flex-col items-center justify-center px-6 text-center">
    <div className="mb-4 rounded-full bg-green-50 p-4 text-green-600 dark:bg-green-900/30 dark:text-green-300">
      <MessageCircle className="h-8 w-8" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
      {title}
    </h3>
    <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
      {text}
    </p>
  </div>
);

const Avatar = ({ participant, name, online }) => {
  const avatar = getParticipantAvatar(participant);

  return (
    <div className="relative shrink-0">
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="h-11 w-11 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-yellow-400 text-sm font-bold text-white">
          {getInitials(name)}
        </div>
      )}

      <span
        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 ${
          online ? 'bg-green-500' : 'bg-gray-400'
        }`}
      />
    </div>
  );
};

const AttachmentPreview = ({ attachment }) => {
  const url = attachment?.url || attachment?.secureUrl || attachment?.path;
  const name =
    attachment?.name ||
    attachment?.originalName ||
    attachment?.filename ||
    'Attachment';
  const type = attachment?.mimeType || attachment?.type || '';
  const isImage = type.startsWith('image') || /\.(png|jpe?g|webp)$/i.test(name);

  if (isImage && url) {
    return (
      <a href={url} target="_blank" rel="noreferrer">
        <img
          src={url}
          alt={name}
          className="mt-2 max-h-56 rounded-xl object-cover"
        />
      </a>
    );
  }

  return (
    <a
      href={url || '#'}
      target="_blank"
      rel="noreferrer"
      className="mt-2 flex items-center gap-2 rounded-lg bg-black/5 p-3 text-sm dark:bg-white/10"
    >
      <FileText className="h-4 w-4 shrink-0" />
      <span className="truncate">{name}</span>
    </a>
  );
};

const MessageBubble = ({ message, currentUserId }) => {
  const senderId = getMessageSenderId(message);
  const mine = String(senderId) === String(currentUserId);
  const attachments = message?.attachments || [];
  const status =
    message?.status ||
    (message?.readAt ? 'read' : message?.deliveredAt ? 'delivered' : 'sent');

  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[84%] rounded-2xl px-4 py-2 shadow-sm sm:max-w-[68%] ${
          mine
            ? 'rounded-br-sm bg-green-600 text-white'
            : 'rounded-bl-sm bg-white text-gray-900 dark:bg-gray-800 dark:text-white'
        }`}
      >
        {message?.text && (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.text}
          </p>
        )}

        {attachments.map((attachment, index) => (
          <AttachmentPreview
            key={attachment?._id || attachment?.id || index}
            attachment={attachment}
          />
        ))}

        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
            mine ? 'text-green-50' : 'text-gray-400'
          }`}
        >
          {message?.editedAt && <span>edited</span>}
          <span>{formatTime(message?.createdAt)}</span>
          {mine &&
            (status === 'read' || status === 'delivered' ? (
              <CheckCheck className="h-3.5 w-3.5" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            ))}
        </div>
      </div>
    </div>
  );
};

const ConversationItem = ({
  conversation,
  active,
  currentUserId,
  currentRole,
  onlineUsers,
  onClick,
}) => {
  const participant = getOtherParticipant(
    conversation,
    currentUserId,
    currentRole
  );
  const name = getParticipantDisplayName(participant) || 'Unknown user';
  const role = getParticipantRole(participant);
  const unread = conversation?.unreadCount || conversation?.unread || 0;
  const last =
    conversation?.lastMessage?.text ||
    conversation?.lastMessageText ||
    (conversation?.lastMessage?.attachments?.length
      ? 'Attachment'
      : 'No messages yet');
  const online = isParticipantOnline(onlineUsers, participant);

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 border-b border-gray-100 p-4 text-left transition dark:border-gray-800 ${
        active
          ? 'bg-green-50 dark:bg-green-900/20'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/80'
      }`}
    >
      <Avatar participant={participant} name={name} online={online} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {name}
          </p>
          <span className="shrink-0 text-[11px] text-gray-400">
            {formatDate(conversation?.lastMessageAt || conversation?.updatedAt)}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            <span className="capitalize">{role}</span> • {last}
          </p>

          {unread > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1.5 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

const Messages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const { showToast } = useToast();

  const { user, role } = useSelector((state) => state.auth);
  const currentUserId = getChatId(user);

  const {
    conversations,
    activeConversationId,
    messagesByConversation,
    loadingConversations,
    loadingMessages,
    sending,
    error,
    onlineUsers,
    typingByConversation,
    conversationPagination,
  } = useSelector((state) => state.chat);

  const [search, setSearch] = useState('');
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [messageSearch, setMessageSearch] = useState('');

  const messagesEndRef = useRef(null);
  const typingTimer = useRef(null);

  const conversationIds = useMemo(
    () => conversations.map(getConversationId).filter(Boolean),
    [conversations]
  );

  useChatSocket({ activeConversationId, conversationIds });

  const selectedConversation = conversations.find(
    (conversation) =>
      String(getConversationId(conversation)) === String(activeConversationId)
  );

  const activeConversation =
    selectedConversation ||
    (activeConversationId
      ? {
          _id: activeConversationId,
          id: activeConversationId,
          participants: [],
        }
      : null);

  const activeParticipant =
    selectedConversation && currentUserId
      ? getOtherParticipant(selectedConversation, currentUserId, role)
      : null;

  const activeName = activeParticipant
    ? getParticipantDisplayName(activeParticipant) || 'Chat'
    : loadingConversations
      ? 'Loading chat...'
      : 'Chat';

  const activeRole = activeParticipant
    ? getParticipantRole(activeParticipant)
    : 'vendor';

  const activeParticipantId = activeParticipant
    ? getParticipantIds(activeParticipant)[0]
    : '';

  const activeOnline = activeParticipant
    ? isParticipantOnline(onlineUsers, activeParticipant)
    : false;

  const messages = activeConversationId
    ? messagesByConversation[activeConversationId] || []
    : [];

  const otherTyping = useMemo(
    () =>
      Object.entries(typingByConversation[activeConversationId] || {}).some(
        ([id, value]) => String(id) !== String(currentUserId) && value
      ),
    [typingByConversation, activeConversationId, currentUserId]
  );

  useEffect(() => {
    dispatch(fetchConversations({ page: 1, search }));
  }, [dispatch, search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const targetUserId = params.get('targetUserId');
    const targetRole = params.get('targetRole');

    if (!targetUserId || !targetRole) return;

    dispatch(startConversation({ targetUserId, targetRole }))
      .unwrap()
      .then((conversation) => {
        const conversationId = getConversationId(conversation);

        if (!conversationId) {
          showToast('Chat was created but no conversation ID was returned.', 'error');
          return;
        }

        dispatch(setActiveConversation(conversationId));
        navigate(`/${role}/messages?conversationId=${encodeURIComponent(conversationId)}`, {
          replace: true,
        });
      })
      .catch((err) => showToast(err, 'error'));
  }, [dispatch, location.search, navigate, role, showToast]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const conversationId = params.get('conversationId');

    if (conversationId) {
      dispatch(setActiveConversation(conversationId));
      setShowSidebar(false);
    }
  }, [dispatch, location.search]);

  useEffect(() => {
    if (!activeConversationId) return;

    dispatch(
      fetchMessages({
        conversationId: activeConversationId,
        page: 1,
        q: messageSearch,
      })
    );

    dispatch(markConversationRead(activeConversationId));
    emitMessageRead(activeConversationId);
    setShowSidebar(false);
  }, [dispatch, activeConversationId, messageSearch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages.length, activeConversationId]);

  useEffect(() => {
    if (error) showToast(error, 'error');
  }, [error, showToast]);

  const openConversation = (conversation) => {
    const conversationId = getConversationId(conversation);

    if (!conversationId) return;

    dispatch(setActiveConversation(conversationId));
    setShowSidebar(false);
    navigate(`/${role}/messages?conversationId=${encodeURIComponent(conversationId)}`);
  };

  const handleTyping = (value) => {
    setMessageText(value);

    if (!activeConversationId) return;

    emitTypingStart(activeConversationId);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(
      () => emitTypingStop(activeConversationId),
      900
    );
  };

  const handleSend = async (event) => {
    event.preventDefault();

    if (
      !activeConversationId ||
      (!messageText.trim() && attachments.length === 0)
    ) {
      return;
    }

    try {
      await dispatch(
        sendChatMessage({
          conversationId: activeConversationId,
          text: messageText.trim(),
          attachments,
        })
      ).unwrap();

      setMessageText('');
      setAttachments([]);
      emitTypingStop(activeConversationId);
    } catch (err) {
      showToast(err, 'error');
    }
  };

  const handleLoadMoreConversations = () => {
    if (conversationPagination.page < conversationPagination.totalPages) {
      dispatch(
        fetchConversations({
          page: conversationPagination.page + 1,
          search,
        })
      );
    }
  };

  const handleAction = async (action) => {
    if (!activeConversationId) return;

    try {
      if (action === 'archive') {
        await dispatch(archiveConversation(activeConversationId)).unwrap();
      }

      if (action === 'unarchive') {
        await dispatch(unarchiveConversation(activeConversationId)).unwrap();
      }

      if (action === 'delete') {
        await dispatch(deleteConversation(activeConversationId)).unwrap();
      }

      if (action === 'block') {
        await dispatch(
          blockChatUser({
            targetUserId: activeParticipantId,
            targetRole: activeRole,
          })
        ).unwrap();
      }

      if (action === 'unblock') {
        await dispatch(unblockChatUser({ targetUserId: activeParticipantId })).unwrap();
      }

      if (action === 'report') {
        await dispatch(
          reportConversation({
            conversationId: activeConversationId,
            reason: 'Reported from frontend chat module',
          })
        ).unwrap();
      }

      showToast('Action completed', 'success');
      setMenuOpen(false);
    } catch (err) {
      showToast(err, 'error');
    }
  };

  const panelBg = isDark ? 'bg-gray-900' : 'bg-gray-50';

  return (
    <div className={`h-[calc(100vh-8rem)] min-h-[560px] overflow-hidden ${panelBg}`}>
      <div className="mx-auto flex h-full max-w-7xl overflow-hidden border-x border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
        <aside
          className={`${showSidebar ? 'flex' : 'hidden'} w-full flex-col border-r border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950 md:flex md:w-[360px] lg:w-[400px]`}
          aria-label="Conversation list"
        >
          <div className="border-b border-gray-100 p-4 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Messages
              </h1>
              <Link to={`/${role}/dashboard`} className="text-sm font-medium text-green-600">
                Dashboard
              </Link>
            </div>

            <label className="relative mt-4 block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search chats, names, unread, archived"
                aria-label="Search conversations"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </label>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {loadingConversations && conversations.length === 0 ? (
              <SkeletonList />
            ) : conversations.length === 0 ? (
              <EmptyState
                title="No conversations"
                text="Start a chat from a vendor profile, vendor card, or dashboard access point."
              />
            ) : (
              conversations.map((conversation) => {
                const conversationId = getConversationId(conversation);

                return (
                  <ConversationItem
                    key={conversationId}
                    conversation={conversation}
                    active={String(conversationId) === String(activeConversationId)}
                    currentUserId={currentUserId}
                    currentRole={role}
                    onlineUsers={onlineUsers}
                    onClick={() => openConversation(conversation)}
                  />
                );
              })
            )}
          </div>

          {conversationPagination.page < conversationPagination.totalPages && (
            <button
              onClick={handleLoadMoreConversations}
              className="border-t border-gray-100 p-3 text-sm font-semibold text-green-600 dark:border-gray-800"
            >
              Load more
            </button>
          )}
        </aside>

        <section
          className={`${!showSidebar ? 'flex' : 'hidden'} min-w-0 flex-1 flex-col md:flex`}
          aria-label="Message panel"
        >
          {!activeConversation ? (
            <EmptyState
              title="Select a conversation"
              text="Choose a chat to view messages, attachments, read receipts, and typing status."
            />
          ) : (
            <>
              <header className="flex shrink-0 items-center gap-3 border-b border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <Avatar
                  participant={activeParticipant}
                  name={activeName}
                  online={activeOnline}
                />

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-bold text-gray-900 dark:text-white">
                    {activeName}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="capitalize">{activeRole}</span> •{' '}
                    {otherTyping ? 'typing...' : activeOnline ? 'online' : 'offline'}
                  </p>
                </div>

                <label className="relative hidden sm:block">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    value={messageSearch}
                    onChange={(event) => setMessageSearch(event.target.value)}
                    placeholder="Search messages"
                    aria-label="Search messages"
                    className="w-44 rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </label>

                <div className="relative">
                  <button
                    onClick={() => setMenuOpen((value) => !value)}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    aria-label="Open chat actions"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
                      <button
                        onClick={() =>
                          handleAction(activeConversation?.archived ? 'unarchive' : 'archive')
                        }
                        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                      >
                        <Archive className="h-4 w-4" />
                        {activeConversation?.archived ? 'Unarchive chat' : 'Archive chat'}
                      </button>

                      <button
                        onClick={() =>
                          handleAction(activeConversation?.blocked ? 'unblock' : 'block')
                        }
                        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                      >
                        <Ban className="h-4 w-4" />
                        {activeConversation?.blocked ? 'Unblock user' : 'Block user'}
                      </button>

                      <button
                        onClick={() => handleAction('report')}
                        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-yellow-700 hover:bg-yellow-50 dark:text-yellow-300 dark:hover:bg-gray-800"
                      >
                        <ShieldAlert className="h-4 w-4" />
                        Report chat
                      </button>

                      <button
                        onClick={() => handleAction('delete')}
                        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-800"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete chat
                      </button>
                    </div>
                  )}
                </div>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900">
                {loadingMessages ? (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading messages
                  </div>
                ) : messages.length === 0 ? (
                  <EmptyState
                    title="No messages yet"
                    text="Send a text message, image, or document to begin this conversation."
                  />
                ) : (
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <MessageBubble
                        key={getMessageId(message)}
                        message={message}
                        currentUserId={currentUserId}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {attachments.length > 0 && (
                <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
                  {attachments.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    >
                      {file.type.startsWith('image') ? (
                        <ImageIcon className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                      <span className="max-w-32 truncate">{file.name}</span>
                      <button
                        onClick={() =>
                          setAttachments((current) =>
                            current.filter((_, itemIndex) => itemIndex !== index)
                          )
                        }
                        aria-label="Remove attachment"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form
                onSubmit={handleSend}
                className="flex shrink-0 items-end gap-2 border-t border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950"
              >
                <label
                  className="cursor-pointer rounded-xl p-3 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  aria-label="Attach files"
                >
                  <Paperclip className="h-5 w-5" />
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,application/pdf,.doc,.docx"
                    className="hidden"
                    onChange={(event) =>
                      setAttachments(Array.from(event.target.files || []).slice(0, 5))
                    }
                  />
                </label>

                <textarea
                  value={messageText}
                  onChange={(event) => handleTyping(event.target.value)}
                  rows={1}
                  placeholder="Type a message"
                  aria-label="Type a message"
                  className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />

                <button
                  type="submit"
                  disabled={sending || (!messageText.trim() && attachments.length === 0)}
                  className="rounded-xl bg-green-600 p-3 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  {sending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Messages;