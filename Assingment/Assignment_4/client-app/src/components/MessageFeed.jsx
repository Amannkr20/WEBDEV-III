import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { Loader2 } from 'lucide-react';

export default function MessageFeed({
  messages,
  currentUser,
  loading,
  error,
  typingList,
  onRetry,
}) {
  const bottomRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingList]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 bg-[#141414] flex flex-col justify-between">
      <div>
        {/* Loading History Indicator */}
        {loading && (
          <div className="flex items-center justify-center py-6 text-sm text-[#737373] gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#A3A3A3]" />
            <span>Loading messages...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-[#242424] border border-[#333333] p-3 rounded-xl text-center my-4 max-w-md mx-auto">
            <p className="text-xs text-[#A3A3A3] mb-2">{error}</p>
            <button
              onClick={onRetry}
              className="text-xs font-semibold px-3 py-1 bg-[#333333] hover:bg-[#404040] text-[#F5F5F5] rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Centered Date Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#262626]" />
          </div>
          <div className="relative px-3 bg-[#141414] text-[11px] font-medium text-[#737373] uppercase tracking-wider">
            Today
          </div>
        </div>

        {/* Empty state */}
        {!loading && messages.length === 0 && !error && (
          <div className="text-center py-16 px-4">
            <p className="text-sm font-medium text-[#A3A3A3]">No messages yet</p>
            <p className="text-xs text-[#737373] mt-1">
              Be the first to say hello and start the conversation!
            </p>
          </div>
        )}

        {/* Message List */}
        {messages.map((msg, index) => {
          const key = msg._id || msg.id || `msg-${index}-${msg.time}`;
          const isOutgoing = msg.sender === currentUser;
          return (
            <MessageBubble
              key={key}
              message={msg}
              isOutgoing={isOutgoing}
              currentUser={currentUser}
            />
          );
        })}

        {/* Typing indicator inside feed */}
        {typingList && typingList.length > 0 && (
          <div className="flex items-start gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#242424] border border-[#333333] flex items-center justify-center font-semibold text-xs text-[#F5F5F5] shrink-0 mt-0.5">
              {typingList[0].substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-xs font-medium text-[#A3A3A3]">
                  {typingList.join(', ')}
                </span>
                <span className="text-[11px] text-[#737373]">typing...</span>
              </div>
              <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-[#262626] text-[#F5F5F5] flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-[#A3A3A3] rounded-full typing-dot-1" />
                <span className="w-1.5 h-1.5 bg-[#A3A3A3] rounded-full typing-dot-2" />
                <span className="w-1.5 h-1.5 bg-[#A3A3A3] rounded-full typing-dot-3" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
