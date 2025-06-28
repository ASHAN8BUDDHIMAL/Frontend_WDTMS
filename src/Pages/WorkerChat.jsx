import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FaPaperPlane, FaSearch } from 'react-icons/fa';

const ChatPage = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [conversationUsers, setConversationUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/users/me', { withCredentials: true });
        setCurrentUserId(res.data.id);
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch users in conversation
  useEffect(() => {
    const fetchConversationUsers = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/messages/conversation-users', { withCredentials: true });
        setConversationUsers(res.data);
      } catch (err) {
        console.error('Error fetching conversation users:', err);
      }
    };
    fetchConversationUsers();
  }, [messages]);

  // Search users
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8080/api/messages/users/search?name=${query}`, {
        withCredentials: true
      });
      setSearchResults(res.data.filter(user => user.id !== currentUserId));
    } catch (err) {
      console.error('Error searching users:', err);
    }
  };

  // Fetch conversation
  const fetchConversation = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/messages/conversation/${userId}`, {
        withCredentials: true
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching conversation:', err);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    setSearchResults([]);
    setSearchQuery('');
    fetchConversation(userId);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId) return;
    try {
      await axios.post(
        'http://localhost:8080/api/messages',
        {
          senderToId: selectedUserId,
          content: newMessage,
        },
        { withCredentials: true }
      );
      setNewMessage('');
      fetchConversation(selectedUserId);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-1/4 border-r bg-white shadow-lg overflow-y-auto mt-16">
        <div className="p-4 border-b bg-gradient-to-r from-blue-400 to-blue-600 text-white sticky top-0 z-10">
          <h2 className="text-xl font-bold font-mono tracking-wide">Messages</h2>
          <div className="relative mt-3">
            <FaSearch className="absolute left-3 top-3 text-blue-200" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-blue-400 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Show Search Results or Conversation Users */}
        <div className="divide-y divide-gray-100">
          {(searchQuery.trim() ? searchResults : conversationUsers).map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserSelect(user.id)}
              className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors duration-200 flex items-center ${
                selectedUserId === user.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center font-semibold mr-3">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500">@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUserId ? (
          <>
            <div className="p-4 border-b bg-white font-semibold mt-16 sticky top-0 z-10 shadow-sm flex items-center">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-semibold mr-3">
                {conversationUsers.find((u) => u.id === selectedUserId)?.firstName.charAt(0) ||
                searchResults.find((u) => u.id === selectedUserId)?.firstName.charAt(0)}
              </div>
              <div>
                <p className="text-gray-800">
                  {conversationUsers.find((u) => u.id === selectedUserId)?.firstName ||
                  searchResults.find((u) => u.id === selectedUserId)?.firstName ||
                  'User'}
                </p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>

            <div 
              className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 space-y-4"
              style={{ backgroundImage: "url('https://transparenttextures.com/patterns/cubes.png')" }}
            >
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm max-w-md">
                    <h3 className="text-lg font-medium text-gray-700">No messages yet</h3>
                    <p className="text-gray-500 mt-2">Start the conversation with your first message!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isSender = msg.senderFromId === selectedUserId;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isSender ? 'justify-start' : 'justify-end'} animate-fadeIn`}
                    >
                      <div
                        className={`max-w-md p-4 rounded-2xl ${
                          isSender
                            ? 'bg-white text-gray-800 shadow-sm border border-gray-100'
                            : 'bg-yellow-100 text-gray-800 shadow-md border border-gray-100'
                        } transition-all duration-200 hover:shadow-lg`}
                      >
                        <p className={isSender ? "" : "text-gray-800"}>{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          isSender ? "text-gray-400" : "text-gray-400"
                        }`}>
                          {format(new Date(msg.sentAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t bg-white shadow-lg">
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="flex-1 border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                >
                  <FaPaperPlane className="mr-2" />
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 max-w-md">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPaperPlane className="text-blue-500 text-2xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose from your existing conversations or search for users to start a new chat</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;