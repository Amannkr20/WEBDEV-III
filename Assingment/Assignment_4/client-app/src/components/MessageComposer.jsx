import React, { useState, useRef } from 'react';
import { Smile, Paperclip, Mic, Send, X, FileText } from 'lucide-react';

export default function MessageComposer({ onSendMessage, onTyping, onStopTyping }) {
  const [text, setText] = useState('');
  const [fileAttachment, setFileAttachment] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    setText(e.target.value);

    // Typing presence logic
    if (onTyping) {
      onTyping();
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (onStopTyping) onStopTyping();
    }, 1200);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock or preview file card
      setFileAttachment({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed && !fileAttachment) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (onStopTyping) onStopTyping();

    onSendMessage({
      text: trimmed,
      file: fileAttachment || undefined,
    });

    setText('');
    setFileAttachment(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = text.trim().length > 0 || fileAttachment !== null;

  return (
    <div className="px-6 py-4 bg-[#141414] border-t border-[#262626]/60 shrink-0">
      {/* File attachment preview if selected */}
      {fileAttachment && (
        <div className="mb-2.5 inline-flex items-center gap-2.5 bg-[#242424] border border-[#333333] rounded-xl px-3 py-1.5 text-xs text-[#F5F5F5]">
          <FileText className="w-4 h-4 text-[#A3A3A3]" />
          <span className="font-medium max-w-[200px] truncate">{fileAttachment.name}</span>
          <span className="text-[#737373]">({fileAttachment.size})</span>
          <button
            onClick={() => setFileAttachment(null)}
            className="p-0.5 rounded-full hover:bg-[#333333] text-[#737373] hover:text-[#F5F5F5] transition-colors ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Composer Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-[#242424] border border-[#262626] rounded-2xl px-3 py-2 gap-2 shadow-inner focus-within:border-[#525252] transition-colors"
      >
        {/* Smile Emoji Button */}
        <button
          type="button"
          title="Add emoji"
          onClick={() => setText((prev) => prev + ' 😊 ')}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#737373] hover:text-[#F5F5F5] hover:bg-[#2A2A2A] transition-colors shrink-0"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Borderless Input */}
        <textarea
          rows={1}
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-sm text-[#F5F5F5] placeholder-[#737373] outline-none resize-none max-h-28 py-1 leading-normal"
        />

        {/* Paperclip Attachment Button */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Attach file"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#737373] hover:text-[#F5F5F5] hover:bg-[#2A2A2A] transition-colors shrink-0"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Mic Button (visual only) */}
        <button
          type="button"
          title="Voice message (visual only)"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#737373] hover:text-[#F5F5F5] hover:bg-[#2A2A2A] transition-colors shrink-0"
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* Distinct Square-Rounded Send Button: #525252 */}
        <button
          type="submit"
          disabled={!canSend}
          title="Send message"
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-[#F5F5F5] transition-all shrink-0 ${
            canSend
              ? 'bg-[#525252] hover:bg-[#666666] active:scale-95 shadow'
              : 'bg-[#333333] text-[#737373] cursor-not-allowed opacity-60'
          }`}
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>
    </div>
  );
}
