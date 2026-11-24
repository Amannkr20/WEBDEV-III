import React, { useState, useEffect, useRef } from 'react';
import { socket, SOCKET_URL } from './socket';
import NavRail from './components/NavRail';
import ChatListSidebar from './components/ChatListSidebar';
import ConversationHeader from './components/ConversationHeader';
import MessageFeed from './components/MessageFeed';
import MessageComposer from './components/MessageComposer';
import GroupInfoDrawer from './components/GroupInfoDrawer';
import UserSearchModal from './components/UserSearchModal';
import { MessageSquare, ArrowRight } from 'lucide-react';

// Helper: Deterministic DM Room ID
export function getDMRoomId(userOne, userTwo) {
  if (!userOne || !userTwo) return '';
  const u1 = userOne.trim().toLowerCase();
  const u2 = userTwo.trim().toLowerCase();
  const sorted = [u1, u2].sort();
  return `dm:${sorted[0]}:${sorted[1]}`;
}

const INITIAL_GROUPS = [
  {
    id: 'room-design-team',
    name: 'Design Team',
    isGroup: true,
    avatarInitial: 'DT',
    timestamp: '8:33 PM',
    lastMessage: 'You: Great!',
    unreadCount: 1,
    members: [
      { name: 'Alex Johnson', username: 'alex', role: 'Lead Designer' },
      { name: 'Sarah Chen', username: 'sarah', role: 'UI Engineer' },
      { name: 'Mike Rodriguez', username: 'mike', role: 'Product Manager' },
      { name: 'Emily Taylor', username: 'emily', role: 'Illustrator' },
    ],
  },
  {
    id: 'room-college-buddies',
    name: 'College Buddies',
    isGroup: true,
    avatarInitial: null,
    timestamp: '6:15 PM',
    lastMessage: 'Rohan: Let’s meet at 7 PM',
    unreadCount: 0,
    members: [
      { name: 'Rohan Verma', username: 'rohan', role: 'Student' },
      { name: 'Priya Sharma', username: 'priya', role: 'Student' },
      { name: 'Aman', username: 'aman', role: 'Student' },
    ],
  },
];

const INITIAL_DMS = [
  {
    id: 'dm:alex:sarah',
    name: 'Sarah Chen',
    username: 'sarah',
    isGroup: false,
    timestamp: '7:42 PM',
    lastMessage: 'Can you check the latest wireframe?',
  },
  {
    id: 'dm:alex:mike',
    name: 'Mike Rodriguez',
    username: 'mike',
    isGroup: false,
    timestamp: '5:20 PM',
    lastMessage: 'Awesome work on the monochromatic styling!',
  },
];

export default function App() {
  const [username, setUsername] = useState(() => localStorage.getItem('connectx_user') || '');
  const [hasLoggedIn, setHasLoggedIn] = useState(() => !!localStorage.getItem('connectx_user'));
  const [loginInput, setLoginInput] = useState('');

  // Navigation tab
  const [activeTab, setActiveTab] = useState('chats');

  // Rooms and selection
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [directMessages, setDirectMessages] = useState(INITIAL_DMS);
  const [activeRoom, setActiveRoom] = useState(INITIAL_GROUPS[0]);
  const activeRoomRef = useRef(activeRoom);

  // Messages & interaction states
  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // Presence & typing
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({}); // { roomId: ['username'] }

  // Search & Drawer & Modals
  const [searchQuery, setSearchQuery] = useState('');
  const [showInfoDrawer, setShowInfoDrawer] = useState(true);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Keep ref up to date for socket listeners
  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  // Handle Login / Registration
  const handleLogin = (e) => {
    e?.preventDefault();
    const cleanUser = loginInput.trim();
    if (!cleanUser) return;
    setUsername(cleanUser);
    localStorage.setItem('connectx_user', cleanUser);
    setHasLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('connectx_user');
    setHasLoggedIn(false);
    setUsername('');
    socket.disconnect();
  };

  // Socket Connection & Event Handling
  useEffect(() => {
    if (!hasLoggedIn || !username) return;

    // Connect socket
    socket.connect();

    // Register user
    socket.emit('register_user', username);

    // Initial room join
    if (activeRoomRef.current) {
      if (activeRoomRef.current.isGroup) {
        socket.emit('join_room', activeRoomRef.current.id);
      } else if (activeRoomRef.current.username) {
        socket.emit('join_dm', {
          currentUser: username,
          otherUser: activeRoomRef.current.username,
        });
      }
    }

    // Socket listeners
    const onOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    // Handler for both group messages and direct messages
    const handleIncomingMessage = (msg) => {
      // Avoid duplicate rendering by server-generated _id or messageId
      const msgId = msg._id || msg.messageId;
      setMessages((prev) => {
        const exists = prev.some((m) => (m._id && m._id === msgId) || (m.messageId && m.messageId === msgId));
        if (exists) return prev;
        return [...prev, msg];
      });

      // Update last message in sidebar
      if (msg.roomId) {
        setGroups((prev) =>
          prev.map((g) =>
            g.id === msg.roomId
              ? {
                  ...g,
                  lastMessage: `${msg.sender === username ? 'You' : msg.sender}: ${msg.text || msg.message || 'Shared a file'}`,
                  timestamp: msg.time,
                }
              : g
          )
        );
        setDirectMessages((prev) =>
          prev.map((d) =>
            d.id === msg.roomId
              ? {
                  ...d,
                  lastMessage: msg.text || msg.message || 'Shared a file',
                  timestamp: msg.time,
                }
              : d
          )
        );
      }
    };

    const onReceiveMessage = (msg) => {
      handleIncomingMessage(msg);
    };

    const onReceiveDM = (msg) => {
      handleIncomingMessage(msg);

      // If DM room does not exist in sidebar yet (e.g. initiated by other user), add it
      setDirectMessages((prev) => {
        const exists = prev.some((d) => d.id === msg.roomId);
        if (!exists) {
          const otherUser = msg.sender === username ? msg.receiver : msg.sender;
          const newDM = {
            id: msg.roomId,
            name: otherUser,
            username: otherUser,
            isGroup: false,
            timestamp: msg.time,
            lastMessage: msg.text || msg.message || 'New message',
          };
          return [newDM, ...prev];
        }
        return prev;
      });
    };

    const onUserTyping = ({ roomId, username: typingUser }) => {
      if (typingUser === username) return;
      setTypingUsers((prev) => {
        const currentList = prev[roomId] || [];
        if (!currentList.includes(typingUser)) {
          return { ...prev, [roomId]: [...currentList, typingUser] };
        }
        return prev;
      });
    };

    const onUserStopTyping = ({ roomId, username: typingUser }) => {
      setTypingUsers((prev) => {
        const currentList = prev[roomId] || [];
        return {
          ...prev,
          [roomId]: currentList.filter((u) => u !== typingUser),
        };
      });
    };

    socket.on('online_users', onOnlineUsers);
    socket.on('receive_message', onReceiveMessage);
    socket.on('receive_dm', onReceiveDM);
    socket.on('user_typing', onUserTyping);
    socket.on('user_stop_typing', onUserStopTyping);

    return () => {
      socket.off('online_users', onOnlineUsers);
      socket.off('receive_message', onReceiveMessage);
      socket.off('receive_dm', onReceiveDM);
      socket.off('user_typing', onUserTyping);
      socket.off('user_stop_typing', onUserStopTyping);
      socket.disconnect();
    };
  }, [hasLoggedIn, username]);

  // Load message history on room change
  const loadRoomHistory = async (roomId) => {
    setLoadingHistory(true);
    setHistoryError(null);
    try {
      const res = await fetch(`${SOCKET_URL}/api/messages/${encodeURIComponent(roomId)}?currentUser=${encodeURIComponent(username)}`);
      if (!res.ok) {
        throw new Error('Could not load chat history');
      }
      const data = await res.json();
      setMessages(data || []);
    } catch (err) {
      console.error('History load error:', err);
      // Fallback seeds if fresh room
      setMessages([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Switch Room Flow
  const handleSelectRoom = (room) => {
    if (activeRoom?.id === room.id) return;

    // Leave previous room
    if (activeRoom?.id) {
      socket.emit('leave_room', activeRoom.id);
    }

    // Join new room using appropriate event
    if (room.isGroup) {
      socket.emit('join_room', room.id);
    } else {
      socket.emit('join_dm', {
        currentUser: username,
        otherUser: room.username,
      });
    }

    // Clear unread count on open
    setGroups((prev) =>
      prev.map((g) => (g.id === room.id ? { ...g, unreadCount: 0 } : g))
    );

    setActiveRoom(room);
    setMessages([]); // Clear previous messages
    loadRoomHistory(room.id);
  };

  // Initial history load
  useEffect(() => {
    if (hasLoggedIn && activeRoom?.id) {
      loadRoomHistory(activeRoom.id);
    }
  }, [hasLoggedIn, activeRoom?.id]);

  // Send Message Flow (Group or DM)
  const handleSendMessage = ({ text, file }) => {
    if (!activeRoom?.id || !username) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (activeRoom.isGroup) {
      // Group message
      const payload = {
        roomId: activeRoom.id,
        sender: username,
        text: text || '',
        message: text || '',
        file: file || undefined,
        time: currentTime,
      };
      socket.emit('send_message', payload);
    } else {
      // One-to-one Direct message
      const dmPayload = {
        roomId: activeRoom.id,
        sender: username,
        receiver: activeRoom.username,
        message: text || '',
        text: text || '',
        file: file || undefined,
        time: currentTime,
      };
      socket.emit('send_dm', dmPayload);
    }
  };

  // Typing Handlers
  const handleTyping = () => {
    if (!activeRoom?.id || !username) return;
    socket.emit('typing', { roomId: activeRoom.id, username });
  };

  const handleStopTyping = () => {
    if (!activeRoom?.id || !username) return;
    socket.emit('stop_typing', { roomId: activeRoom.id, username });
  };

  // Add Room Modals / Quick Actions
  const handleAddGroup = () => {
    const name = prompt('Enter new group name:');
    if (!name) return;
    const newGroup = {
      id: `room-${Date.now()}`,
      name,
      isGroup: true,
      avatarInitial: name.substring(0, 2).toUpperCase(),
      timestamp: 'Just now',
      lastMessage: 'Group created',
      unreadCount: 0,
      members: [{ name: username, username, role: 'Creator' }],
    };
    setGroups((prev) => [newGroup, ...prev]);
    handleSelectRoom(newGroup);
  };

  // Open Search Dialog for DM
  const handleOpenDMSearch = () => {
    setIsSearchModalOpen(true);
  };

  // When user is selected from search dialog
  const handleSelectUserFromSearch = (targetUsername) => {
    if (!targetUsername || targetUsername.toLowerCase() === username.toLowerCase()) {
      return;
    }

    const roomId = getDMRoomId(username, targetUsername);
    const existing = directMessages.find((d) => d.id === roomId);

    if (existing) {
      handleSelectRoom(existing);
      return;
    }

    const newDM = {
      id: roomId,
      name: targetUsername,
      username: targetUsername,
      isGroup: false,
      timestamp: 'Just now',
      lastMessage: 'Start a conversation',
    };

    setDirectMessages((prev) => [newDM, ...prev]);
    handleSelectRoom(newDM);
  };

  // Filter shared files from current room messages
  const roomSharedFiles = messages
    .filter((m) => !!m.file)
    .map((m) => m.file);

  // If user is not yet logged in: Clean Monochromatic Login Gate
  if (!hasLoggedIn) {
    return (
      <div className="w-screen h-screen bg-[#121212] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#171717] border border-[#262626] rounded-3xl p-8 shadow-2xl flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-[#242424] flex items-center justify-center text-[#F5F5F5] mb-5 border border-[#333333]">
            <MessageSquare className="w-7 h-7 text-[#F5F5F5]" />
          </div>
          <h1 className="text-2xl font-bold text-[#F5F5F5] mb-1">ConnectX</h1>
          <p className="text-xs text-[#737373] mb-6 text-center">
            Enter your display name to start real-time messaging
          </p>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                autoFocus
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="e.g. Aman, Chrome, Alex..."
                className="w-full bg-[#242424] border border-[#262626] rounded-xl px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#737373] outline-none focus:border-[#525252] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={!loginInput.trim()}
              className="w-full py-3 px-4 bg-[#525252] hover:bg-[#666666] disabled:bg-[#262626] disabled:text-[#737373] text-[#F5F5F5] font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Join ConnectX</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex bg-[#121212] text-[#F5F5F5] overflow-hidden">
      {/* Column 1: Left Nav Rail (68px) */}
      <NavRail
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        currentUser={username}
      />

      {/* Column 2: Chat List Sidebar (300px) */}
      <ChatListSidebar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        groups={groups}
        directMessages={directMessages}
        activeRoom={activeRoom}
        onSelectRoom={handleSelectRoom}
        onAddGroup={handleAddGroup}
        onAddDM={handleOpenDMSearch}
        onlineUsers={onlineUsers}
        typingUsers={typingUsers}
      />

      {/* Column 3: Active Conversation (Flex-1) */}
      <main className="flex-1 flex flex-col h-screen bg-[#141414] min-w-0">
        <ConversationHeader
          activeRoom={activeRoom}
          onToggleInfo={() => setShowInfoDrawer((prev) => !prev)}
          showInfoPanel={showInfoDrawer}
          onlineCount={onlineUsers.length}
        />

        <MessageFeed
          messages={messages}
          currentUser={username}
          loading={loadingHistory}
          error={historyError}
          typingList={typingUsers[activeRoom?.id] || []}
          onRetry={() => loadRoomHistory(activeRoom?.id)}
        />

        <MessageComposer
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
        />
      </main>

      {/* Column 4: Group Info Drawer (280px) */}
      {showInfoDrawer && (
        <GroupInfoDrawer
          activeRoom={activeRoom}
          onClose={() => setShowInfoDrawer(false)}
          onlineUsers={onlineUsers}
          sharedFiles={roomSharedFiles}
        />
      )}

      {/* User Search Dialog for Direct Messaging */}
      <UserSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        currentUser={username}
        onSelectUser={handleSelectUserFromSearch}
      />
    </div>
  );
}
