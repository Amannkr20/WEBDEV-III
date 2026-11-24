import React, { useState, useEffect } from 'react';
import { Search, X, User, AlertCircle, Loader2 } from 'lucide-react';
import { socket, SOCKET_URL } from '../socket';

export default function UserSearchModal({ isOpen, onClose, currentUser, onSelectUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setResults([]);
      setSearched(false);
      setError(null);
      return;
    }

    // Auto-fetch current active users when opening
    fetchUsers('');

    // Also register real-time socket search fallback listener
    const onSearchResults = (data) => {
      setResults(data);
      setSearched(true);
      setLoading(false);
      setError(null);
    };

    socket.on('search_users_result', onSearchResults);
    return () => {
      socket.off('search_users_result', onSearchResults);
    };
  }, [isOpen]);

  const fetchUsers = async (query) => {
    setLoading(true);
    setError(null);

    // Try REST fetch first
    try {
      const res = await fetch(
        `${SOCKET_URL}/api/users/search?q=${encodeURIComponent(query)}&currentUser=${encodeURIComponent(currentUser)}`
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setSearched(true);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('REST search failed, falling back to socket search_users:', err);
    }

    // Fallback directly to socket search_users
    if (socket.connected) {
      socket.emit('search_users', query);
    } else {
      setError('Error searching users. Make sure the backend server is running.');
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    fetchUsers(searchTerm.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-[#171717] border border-[#262626] rounded-2xl p-5 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
          <h3 className="text-base font-bold text-[#F5F5F5]">Start Direct Message</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-[#242424] text-[#A3A3A3] hover:text-[#F5F5F5] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="mt-4">
          <div className="relative flex items-center bg-[#242424] rounded-xl px-3 py-2 border border-[#262626] focus-within:border-[#525252] transition-colors">
            <Search className="w-4 h-4 text-[#737373] mr-2 shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by username..."
              className="w-full bg-transparent text-sm text-[#F5F5F5] placeholder-[#737373] outline-none"
            />
            {loading && <Loader2 className="w-4 h-4 text-[#A3A3A3] animate-spin shrink-0" />}
          </div>
        </form>

        {/* Results List */}
        <div className="mt-4 max-h-60 overflow-y-auto space-y-1">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-[#242424] border border-[#333333] rounded-xl text-xs text-[#A3A3A3]">
              <AlertCircle className="w-4 h-4 text-[#737373] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && searched && results.length === 0 && !error && (
            <div className="text-center py-8">
              <p className="text-sm font-medium text-[#A3A3A3]">User not found</p>
              <p className="text-xs text-[#737373] mt-1">
                No active users match "{searchTerm}". Users must be registered and online to receive direct messages.
              </p>
            </div>
          )}

          {results.map((user) => (
            <button
              key={user.normalized}
              onClick={() => {
                onSelectUser(user.username);
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#242424] transition-colors text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-9 h-9 shrink-0">
                  <div className="w-9 h-9 rounded-full bg-[#262626] border border-[#333333] flex items-center justify-center font-semibold text-xs text-[#F5F5F5]">
                    {user.username.substring(0, 2).toUpperCase()}
                  </div>
                  {/* Status dot */}
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#171717] ${
                      user.isOnline ? 'bg-[#22C55E]' : 'bg-[#525252]'
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <span className="font-medium text-sm text-[#F5F5F5] truncate block">
                    {user.username}
                  </span>
                  <span className="text-[11px] text-[#737373] truncate block">
                    {user.isOnline ? 'Active now' : 'Offline'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    user.isOnline ? 'bg-[#22C55E]' : 'bg-[#525252]'
                  }`}
                />
                <span className="text-xs text-[#A3A3A3]">
                  {user.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
