const toStringId = (value) => (value === undefined || value === null ? '' : String(value));

export const cleanChatIds = (ids = []) => [...new Set(ids.filter(Boolean).map(toStringId))];

export const getChatId = (value = {}) => {
  if (typeof value === 'string' || typeof value === 'number') return toStringId(value);

  return toStringId(
    value?.userId ||
      value?.accountId ||
      value?.authUserId ||
      value?.user?._id ||
      value?.user?.id ||
      value?.profile?.userId ||
      value?._id ||
      value?.id ||
      value?.profileId ||
      value?.profile?._id ||
      value?.profile?.id ||
      value?.buyer?._id ||
      value?.buyer?.id ||
      value?.vendor?._id ||
      value?.vendor?.id ||
      value?.buyerInfo?._id ||
      value?.buyerInfo?.id ||
      value?.vendorInfo?._id ||
      value?.vendorInfo?.id ||
      ''
  );
};

export const getMessageConversationId = (message = {}) => getChatId(message?.conversationId || message?.conversation || message?.conversation_id);

export const getMessageSenderId = (message = {}) => getChatId(message?.senderId || message?.sender || message?.from || message?.senderUser);

export const getParticipantIds = (participant = {}) => {
  const rawUser = participant?.user;
  const profile = participant?.profile || participant?.vendorInfo || participant?.buyerInfo || participant?.vendor || participant?.buyer || {};

  return cleanChatIds([
    rawUser,
    participant?.userId,
    participant?.accountId,
    participant?.authUserId,
    participant?.participantId,
    participant?.profileId,
    participant?._id,
    participant?.id,
    profile?.user,
    profile?.userId,
    profile?.accountId,
    profile?.authUserId,
    profile?._id,
    profile?.id,
    rawUser?._id,
    rawUser?.id,
    rawUser?.userId,
  ]);
};

export const getParticipantRole = (participant = {}) => {
  const user = typeof participant?.user === 'object' ? participant.user : {};
  const profile = participant?.profile || participant?.vendorInfo || participant?.buyerInfo || participant?.vendor || participant?.buyer || {};

  return (
    participant?.role ||
    participant?.userRole ||
    participant?.participantRole ||
    profile?.role ||
    profile?.userRole ||
    user?.role ||
    user?.userRole ||
    (participant?.businessName || participant?.storeName || profile?.businessName || profile?.storeName ? 'vendor' : '') ||
    'user'
  );
};

export const getParticipantDisplayName = (participant = {}) => {
  const user = typeof participant?.user === 'object' ? participant.user : {};
  const profile = participant?.profile || participant?.vendorInfo || participant?.buyerInfo || participant?.vendor || participant?.buyer || {};

  return (
    participant?.businessName ||
    participant?.storeName ||
    participant?.name ||
    participant?.fullName ||
    profile?.businessName ||
    profile?.storeName ||
    profile?.name ||
    profile?.fullName ||
    profile?.identity?.fullName ||
    user?.businessName ||
    user?.storeName ||
    user?.name ||
    user?.fullName ||
    user?.identity?.fullName ||
    participant?.email ||
    profile?.email ||
    user?.email ||
    ''
  );
};

export const getParticipantAvatar = (participant = {}) => {
  const user = typeof participant?.user === 'object' ? participant.user : {};
  const profile = participant?.profile || participant?.vendorInfo || participant?.buyerInfo || participant?.vendor || participant?.buyer || {};

  return (
    participant?.avatar ||
    participant?.profilePhoto ||
    participant?.image ||
    profile?.avatar ||
    profile?.profilePhoto ||
    profile?.image ||
    user?.avatar ||
    user?.profilePhoto ||
    user?.image ||
    ''
  );
};

export const getOtherParticipant = (conversation = {}, currentUserId = '', currentRole = '') => {
  const participants = conversation?.participants || conversation?.members || [];
  const currentId = toStringId(currentUserId);

  if (!participants.length) return conversation?.otherParticipant || conversation?.participant || conversation?.receiver || {};

  const byId = participants.find((participant) => !getParticipantIds(participant).includes(currentId));
  if (byId) return byId;

  const byRole = participants.find((participant) => currentRole && getParticipantRole(participant) !== currentRole);
  return byRole || participants[0] || {};
};

export const getInitials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map((item) => item[0]?.toUpperCase()).join('') || 'CT';

export const isParticipantOnline = (onlineUsers = {}, participant = {}) => {
  const role = getParticipantRole(participant);
  const keys = getParticipantIds(participant).flatMap((id) => [id, `${role}:${id}`, `${id}:${role}`]);
  return keys.some((key) => Boolean(onlineUsers[key]));
};
