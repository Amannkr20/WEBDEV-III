import React from 'react';
import { Search, Phone, Video, MoreVertical, PanelRight } from 'lucide-react';

export default function ConversationHeader({
  activeRoom,
  onToggleInfo,
  showInfoPanel,
  onlineCount,
}) {
  const isGroup = activeRoom?.isGroup;

  return (
    <header className="h-16 px-6 bg-[#171717]/80 backdrop-blur-md border-b border-[#262626] flex items-center justify-between select-none z-10 shrink-0">
      {/* Left Details */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-[#262626] border border-[#333333] flex items-center justify-center font-semibold text-sm text-[#F5F5F5] shrink-0">
          {activeRoom?.avatarInitial ||
            (activeRoom?.name ? activeRoom.name.substring(0, 2).toUpperCase() : 'C')}
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-semibold text-[#F5F5F5] truncate leading-tight">
            {activeRoom?.name || 'Conversation'}
          </h2>
          <p className="text-xs text-[#737373] truncate">
            {isGroup
              ? `${activeRoom?.members?.length || 4} members • Group Chat (${onlineCount} online)`
              : activeRoom?.online
              ? 'Online'
              : 'Direct Message'}
          </p>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-1 text-[#A3A3A3]">
        <button
          title="Search conversation"
          className="w-9 h-9 rounded-xl hover:bg-[#242424] hover:text-[#F5F5F5] flex items-center justify-center transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          title="Phone call (visual only)"
          className="w-9 h-9 rounded-xl hover:bg-[#242424] hover:text-[#F5F5F5] flex items-center justify-center transition-colors"
        >
          <Phone className="w-4 h-4" />
        </button>

        <button
          title="Video call (visual only)"
          className="w-9 h-9 rounded-xl hover:bg-[#242424] hover:text-[#F5F5F5] flex items-center justify-center transition-colors"
        >
          <Video className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleInfo}
          title={showInfoPanel ? 'Hide Group Info' : 'Show Group Info'}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            showInfoPanel
              ? 'bg-[#262626] text-[#F5F5F5]'
              : 'hover:bg-[#242424] hover:text-[#F5F5F5]'
          }`}
        >
          <PanelRight className="w-4 h-4" />
        </button>

        <button
          title="More options"
          className="w-9 h-9 rounded-xl hover:bg-[#242424] hover:text-[#F5F5F5] flex items-center justify-center transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
