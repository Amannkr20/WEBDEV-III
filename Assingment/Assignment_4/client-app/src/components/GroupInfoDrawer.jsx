import React from 'react';
import { X, FileText, Download } from 'lucide-react';

export default function GroupInfoDrawer({
  activeRoom,
  onClose,
  onlineUsers,
  sharedFiles = [],
}) {
  const members = activeRoom?.members || [
    { name: 'Alex Johnson', username: 'alex', role: 'Lead Designer' },
    { name: 'Sarah Chen', username: 'sarah', role: 'UI Engineer' },
    { name: 'Mike Rodriguez', username: 'mike', role: 'Product Manager' },
    { name: 'Emily Taylor', username: 'emily', role: 'Illustrator' },
  ];

  // Default mock shared files if empty
  const displayFiles =
    sharedFiles.length > 0
      ? sharedFiles
      : [
          { name: 'project.zip', size: '2.4 MB', url: '#' },
          { name: 'design-spec.pdf', size: '1.8 MB', url: '#' },
        ];

  return (
    <aside className="w-[280px] min-w-[280px] h-screen bg-[#171717] border-l border-[#262626] flex flex-col select-none overflow-y-auto z-10">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#262626]/50">
        <h3 className="text-base font-bold text-[#F5F5F5] tracking-tight">Group Info</h3>
        <button
          onClick={onClose}
          title="Close drawer"
          className="w-7 h-7 rounded-lg hover:bg-[#242424] text-[#A3A3A3] hover:text-[#F5F5F5] flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Block */}
      <div className="flex flex-col items-center py-6 px-4 border-b border-[#262626]/50 text-center">
        <div className="w-20 h-20 rounded-full bg-[#242424] border-2 border-[#333333] flex items-center justify-center font-bold text-2xl text-[#F5F5F5] mb-3 shadow-md">
          {activeRoom?.avatarInitial ||
            (activeRoom?.name ? activeRoom.name.substring(0, 2).toUpperCase() : 'DT')}
        </div>
        <h4 className="text-lg font-bold text-[#F5F5F5] truncate max-w-full">
          {activeRoom?.name || 'Design Team'}
        </h4>
        <p className="text-xs text-[#737373] mt-0.5">
          {activeRoom?.isGroup ? `${members.length} members` : 'Direct Conversation'}
        </p>
      </div>

      {/* Members Section */}
      <div className="p-4 border-b border-[#262626]/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#737373]">
            Members ({members.length})
          </span>
          <button className="text-xs text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors">
            See all
          </button>
        </div>

        <div className="space-y-3">
          {members.map((member, index) => {
            const isOnline = onlineUsers.includes(member.username) || member.isSelfOnline;
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-8 h-8 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[#262626] border border-[#333333] flex items-center justify-center font-semibold text-xs text-[#F5F5F5]">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    {/* Status dot */}
                    <span
                      className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-[#171717] ${
                        isOnline ? 'bg-[#22C55E]' : 'bg-[#525252]'
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#F5F5F5] truncate">{member.name}</p>
                    <p className="text-[10px] text-[#737373] truncate">
                      {member.role || `@${member.username}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isOnline ? 'bg-[#22C55E]' : 'bg-[#525252]'
                    }`}
                  />
                  <span className="text-[11px] text-[#737373]">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shared Files Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#737373]">
            Shared Files
          </span>
        </div>

        {displayFiles.length === 0 ? (
          <p className="text-xs text-[#737373] py-2">No files shared yet</p>
        ) : (
          <div className="space-y-2">
            {displayFiles.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-xl bg-[#242424] border border-[#262626] hover:bg-[#2A2A2A] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#2E2E2E] flex items-center justify-center text-[#A3A3A3] shrink-0">
                    <FileText className="w-4 h-4 text-[#F5F5F5]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#F5F5F5] truncate">{f.name}</p>
                    <p className="text-[10px] text-[#737373]">{f.size}</p>
                  </div>
                </div>

                <a
                  href={f.url || '#'}
                  download={f.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-[#333333] hover:bg-[#404040] text-[#F5F5F5] flex items-center justify-center transition-colors ml-2 shrink-0"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
