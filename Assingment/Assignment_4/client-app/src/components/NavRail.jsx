import React from 'react';
import { MessageSquare, Users, Settings, LogOut } from 'lucide-react';

export default function NavRail({ activeTab, setActiveTab, onLogout, currentUser }) {
  return (
    <aside className="w-[68px] min-w-[68px] h-screen bg-[#121212] border-r border-[#262626] flex flex-col items-center justify-between py-5 select-none z-20">
      {/* Top: Logo */}
      <div className="flex flex-col items-center gap-6">
        <div className="w-11 h-11 rounded-2xl bg-[#242424] flex items-center justify-center text-[#F5F5F5] shadow-sm hover:bg-[#2A2A2A] transition-colors cursor-pointer">
          <MessageSquare className="w-5 h-5 text-[#F5F5F5]" />
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col items-center gap-2">
          <button
            onClick={() => setActiveTab('chats')}
            title="Chats"
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${
              activeTab === 'chats'
                ? 'bg-[#262626] text-[#F5F5F5] shadow-inner'
                : 'text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#242424]/60'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1 leading-none">Chats</span>
          </button>

          <button
            onClick={() => setActiveTab('groups')}
            title="Groups"
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${
              activeTab === 'groups'
                ? 'bg-[#262626] text-[#F5F5F5] shadow-inner'
                : 'text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#242424]/60'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1 leading-none">Groups</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            title="Settings"
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${
              activeTab === 'settings'
                ? 'bg-[#262626] text-[#F5F5F5] shadow-inner'
                : 'text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#242424]/60'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1 leading-none">Settings</span>
          </button>
        </nav>
      </div>

      {/* Bottom: Current User indicator & Logout */}
      <div className="flex flex-col items-center gap-3">
        <div
          title={`Logged in as ${currentUser}`}
          className="w-9 h-9 rounded-full bg-[#242424] border border-[#333333] flex items-center justify-center text-xs font-semibold text-[#F5F5F5]"
        >
          {currentUser ? currentUser.substring(0, 2).toUpperCase() : 'U'}
        </div>
        <button
          onClick={onLogout}
          title="Switch User / Logout"
          className="w-10 h-10 rounded-xl text-[#737373] hover:text-[#F5F5F5] hover:bg-[#242424] flex items-center justify-center transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
