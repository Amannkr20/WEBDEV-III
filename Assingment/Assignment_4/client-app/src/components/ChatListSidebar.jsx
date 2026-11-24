import React from 'react';
import { SquarePen, Search, Plus, Users as UsersIcon } from 'lucide-react';

export default function ChatListSidebar({
  searchQuery,
  setSearchQuery,
  groups,
  directMessages,
  activeRoom,
  onSelectRoom,
  onAddGroup,
  onAddDM,
  onlineUsers,
  typingUsers,
}) {
  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDMs = directMessages.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const noResults = filteredGroups.length === 0 && filteredDMs.length === 0;

  return (
    <aside className="w-[300px] min-w-[300px] h-screen bg-[#171717] border-r border-[#262626] flex flex-col select-none z-10">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#262626]/50">
        <h1 className="text-xl font-bold text-[#F5F5F5] tracking-tight">Messages</h1>
        <button
          onClick={onAddGroup}
          title="Compose / New Chat"
          className="w-8 h-8 rounded-lg bg-[#242424] hover:bg-[#2A2A2A] text-[#A3A3A3] hover:text-[#F5F5F5] flex items-center justify-center transition-colors"
        >
          <SquarePen className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="px-4 py-3">
        <div className="relative flex items-center bg-[#242424] rounded-xl px-3 py-2 border border-[#262626] focus-within:border-[#525252] transition-colors">
          <Search className="w-4 h-4 text-[#737373] mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="w-full bg-transparent text-sm text-[#F5F5F5] placeholder-[#737373] outline-none"
          />
        </div>
      </div>

      {/* Chat List Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-2 space-y-5 pb-4">
        {noResults ? (
          <div className="text-center py-10 px-4">
            <p className="text-sm text-[#737373]">No chats found</p>
          </div>
        ) : (
          <>
            {/* Groups Section */}
            {filteredGroups.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-[#737373] uppercase tracking-wider">
                  <span>Groups</span>
                  <button
                    onClick={onAddGroup}
                    title="Add Group"
                    className="hover:text-[#F5F5F5] transition-colors p-0.5 rounded hover:bg-[#242424]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-0.5 mt-1">
                  {filteredGroups.map((group) => {
                    const isActive = activeRoom?.id === group.id;
                    const isTyping = typingUsers[group.id]?.length > 0;
                    const typingText = isTyping
                      ? `${typingUsers[group.id].join(', ')} typing...`
                      : null;

                    return (
                      <button
                        key={group.id}
                        onClick={() => onSelectRoom(group)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${
                          isActive
                            ? 'bg-[#242424] text-[#F5F5F5]'
                            : 'hover:bg-[#2A2A2A]/60 text-[#A3A3A3]'
                        }`}
                      >
                        {/* Group Initial Avatar */}
                        <div className="w-10 h-10 rounded-full bg-[#262626] border border-[#333333] flex items-center justify-center font-semibold text-sm text-[#F5F5F5] shrink-0">
                          {group.avatarInitial ? (
                            group.avatarInitial
                          ) : (
                            <UsersIcon className="w-4 h-4 text-[#A3A3A3]" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-medium text-sm text-[#F5F5F5] truncate">
                              {group.name}
                            </span>
                            <span className="text-[11px] text-[#737373] shrink-0">
                              {group.timestamp || '8:33 PM'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            <p className="text-xs text-[#737373] truncate">
                              {typingText || group.lastMessage || 'No messages yet'}
                            </p>
                            {group.unreadCount > 0 && (
                              <span className="shrink-0 ml-1.5 w-4 h-4 rounded-full bg-[#22C55E] text-[#121212] font-bold text-[10px] flex items-center justify-center">
                                {group.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Direct Messages Section */}
            {filteredDMs.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-[#737373] uppercase tracking-wider">
                  <span>Direct Messages</span>
                  <button
                    onClick={onAddDM}
                    title="Add Direct Message"
                    className="hover:text-[#F5F5F5] transition-colors p-0.5 rounded hover:bg-[#242424]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-0.5 mt-1">
                  {filteredDMs.map((dm) => {
                    const isActive = activeRoom?.id === dm.id;
                    const isOnline = onlineUsers.includes(dm.username);
                    const isTyping = typingUsers[dm.id]?.length > 0;

                    return (
                      <button
                        key={dm.id}
                        onClick={() => onSelectRoom(dm)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${
                          isActive
                            ? 'bg-[#242424] text-[#F5F5F5]'
                            : 'hover:bg-[#2A2A2A]/60 text-[#A3A3A3]'
                        }`}
                      >
                        {/* Circular Avatar + Green Online Dot */}
                        <div className="relative w-10 h-10 shrink-0">
                          <div className="w-10 h-10 rounded-full bg-[#262626] border border-[#333333] flex items-center justify-center font-semibold text-xs text-[#F5F5F5]">
                            {dm.name.substring(0, 2).toUpperCase()}
                          </div>
                          {/* Bottom-right online indicator dot */}
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#171717] ${
                              isOnline ? 'bg-[#22C55E]' : 'bg-[#525252]'
                            }`}
                            title={isOnline ? 'Online' : 'Offline'}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-medium text-sm text-[#F5F5F5] truncate">
                              {dm.name}
                            </span>
                            <span className="text-[11px] text-[#737373] shrink-0">
                              {dm.timestamp || 'Just now'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            <p
                              className={`text-xs truncate ${
                                isTyping ? 'text-[#22C55E] font-medium' : 'text-[#737373]'
                              }`}
                            >
                              {isTyping ? 'typing...' : dm.lastMessage || 'Start a conversation'}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
