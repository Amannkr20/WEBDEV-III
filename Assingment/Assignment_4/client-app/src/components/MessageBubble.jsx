import React from 'react';
import { FileText, Download, CheckCheck } from 'lucide-react';

export default function MessageBubble({ message, isOutgoing, currentUser }) {
  const { sender, text, file, time } = message;
  const hasFile = file && (file.name || file.url);

  return (
    <div className={`flex w-full mb-4 ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start max-w-[70%] gap-2.5 ${isOutgoing ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Left circular avatar for incoming */}
        {!isOutgoing && (
          <div className="w-8 h-8 rounded-full bg-[#242424] border border-[#333333] flex items-center justify-center font-semibold text-xs text-[#F5F5F5] shrink-0 mt-0.5">
            {sender ? sender.substring(0, 2).toUpperCase() : 'U'}
          </div>
        )}

        {/* Message Content & Bubble */}
        <div className={`flex flex-col ${isOutgoing ? 'items-end' : 'items-start'}`}>
          {/* Incoming sender name and timestamp above bubble */}
          {!isOutgoing && (
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-xs font-medium text-[#A3A3A3]">{sender}</span>
              <span className="text-[11px] text-[#737373]">{time || '8:30 PM'}</span>
            </div>
          )}

          {/* Bubble Container: #333333 for outgoing, #262626 for incoming */}
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words shadow-sm ${
              isOutgoing
                ? 'bg-[#333333] text-[#F5F5F5] rounded-tr-sm'
                : 'bg-[#262626] text-[#F5F5F5] rounded-tl-sm'
            }`}
          >
            {/* File Attachment Card if present */}
            {hasFile && (
              <div className="flex items-center gap-3 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl p-2.5 mb-2 hover:bg-[#252525] transition-colors">
                <div className="w-9 h-9 rounded-lg bg-[#2E2E2E] flex items-center justify-center text-[#A3A3A3] shrink-0">
                  <FileText className="w-5 h-5 text-[#F5F5F5]" />
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs font-medium text-[#F5F5F5] truncate">{file.name || 'project.zip'}</p>
                  <p className="text-[11px] text-[#737373]">{file.size || '2.4 MB'}</p>
                </div>
                <a
                  href={file.url || '#'}
                  download={file.name || 'attachment'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-[#333333] hover:bg-[#404040] text-[#F5F5F5] flex items-center justify-center shrink-0 transition-colors"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Message Text */}
            {text && <p className="whitespace-pre-wrap">{text}</p>}

            {/* Outgoing inline timestamp & double check receipt */}
            {isOutgoing && (
              <div className="flex items-center justify-end gap-1.5 mt-1 text-[11px] text-[#A3A3A3]">
                <span>{time || '8:32 PM'}</span>
                <CheckCheck className="w-3.5 h-3.5 text-[#A3A3A3]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
