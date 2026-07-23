// // app/admin/support/page.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/lib/authContext';
// import { useRouter } from 'next/navigation';
// import { rtdb } from '@/lib/firebase';
// import { ref, onChildAdded, push, set, get, query, orderByChild, limitToLast } from 'firebase/database';
// import { Send, MessageCircle, Mail, Phone, RefreshCw, User } from 'lucide-react';

// export default function SupportDashboard() {
//   const { isAdmin } = useAuth();
//   const router = useRouter();
//   const [conversations, setConversations] = useState({});
//   const [selectedChatId, setSelectedChatId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [reply, setReply] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     if (!isAdmin) {
//       router.push('/');
//     }
//   }, [isAdmin]);

//   // ✅ Encode chat ID (remove invalid characters)
//   const encodeChatId = (id) => {
//     if (!id) return 'guest_' + Date.now();
//     return id.toString().replace(/[.#$[\]/@]/g, '_');
//   };

//   // ✅ Load all messages grouped by chatId (email)
//   useEffect(() => {
//     console.log('📡 Listening to all_messages...');
//     const allMessagesRef = ref(rtdb, 'all_messages');
    
//     const unsubscribe = onChildAdded(allMessagesRef, (snapshot) => {
//       const data = snapshot.val();
      
//       let chatId = data.chatId || data.userEmail || data.userId;
      
//       if (!chatId) {
//         console.warn('⚠️ No chatId found:', data);
//         return;
//       }

//       chatId = encodeChatId(chatId);
      
//       console.log('📩 New message for chat:', chatId);
      
//       setConversations(prev => {
//         const existing = prev[chatId] || {
//           chatId: chatId,
//           userEmail: data.userEmail || null,
//           userName: data.userName || 'Guest',
//           userPhone: data.userPhone || null,
//           messages: [],
//           lastMessage: data.message,
//           lastMessageTime: data.timestamp,
//           unreadCount: 0,
//           originalChatId: data.chatId || data.userEmail || chatId
//         };
        
//         // ✅ Check if message already exists to avoid duplicates
//         const messageExists = existing.messages.some(msg => msg.id === snapshot.key);
//         if (!messageExists) {
//           existing.messages.push({ id: snapshot.key, ...data });
//         }
        
//         existing.lastMessage = data.message;
//         existing.lastMessageTime = data.timestamp;
//         existing.unreadCount = existing.messages.filter(
//           msg => !msg.isAdmin && !msg.isRead
//         ).length;
        
//         return { ...prev, [chatId]: existing };
//       });
//     });

//     return () => unsubscribe();
//   }, []);

//   // ✅ Load messages for selected chat
//   const loadChatMessages = (chatId) => {
//     const conv = conversations[chatId];
//     if (conv) {
//       setMessages(conv.messages || []);
//       setSelectedChatId(chatId);
//       console.log(`📨 Loaded ${conv.messages.length} messages for ${chatId}`);
//     }
//   };

//   // ✅ Send reply to specific user - FIXED (No duplicate updates)
//   const sendReply = async (e) => {
//     e.preventDefault();
//     if (!reply.trim()) return;
//     if (!selectedChatId) {
//       alert('Please select a conversation first');
//       return;
//     }

//     setLoading(true);

//     const conversation = conversations[selectedChatId];
//     const encodedChatId = encodeChatId(selectedChatId);
    
//     const messageData = {
//       chatId: encodedChatId,
//       userEmail: conversation.userEmail || null,
//       userName: 'M&M Scents Team',
//       userPhone: conversation.userPhone || null,
//       message: reply.trim(),
//       isAdmin: true,
//       timestamp: Date.now(),
//       isRead: true
//     };

//     console.log('📤 Sending reply to:', encodedChatId);

//     try {
//       // ✅ Save to user's chat room
//       const userChatRef = ref(rtdb, `chats/${encodedChatId}/messages`);
//       const newMsgRef = await push(userChatRef, messageData);
      
//       // ✅ Save to all_messages
//       const allMessagesRef = ref(rtdb, `all_messages/${newMsgRef.key}`);
//       await set(allMessagesRef, {
//         ...messageData,
//         id: newMsgRef.key
//       });

//       // ✅ Clear reply input immediately
//       setReply('');
      
//       // ✅ DO NOT update messages/state here - listener will handle it
//       // The onChildAdded listener will automatically add the message
      
//       console.log('✅ Reply sent to:', encodedChatId);
      
//     } catch (error) {
//       console.error('❌ Error:', error);
//       alert('Failed to send reply. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Refresh conversations
//   const refreshConversations = async () => {
//     setRefreshing(true);
//     try {
//       const allMessagesRef = ref(rtdb, 'all_messages');
//       const snapshot = await get(allMessagesRef);
      
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const newConversations = {};
        
//         Object.keys(data).forEach((key) => {
//           const msg = data[key];
//           let chatId = msg.chatId || msg.userEmail || msg.userId;
          
//           if (!chatId) return;
          
//           chatId = encodeChatId(chatId);
          
//           if (!newConversations[chatId]) {
//             newConversations[chatId] = {
//               chatId: chatId,
//               userEmail: msg.userEmail || null,
//               userName: msg.userName || 'Guest',
//               userPhone: msg.userPhone || null,
//               messages: [],
//               lastMessage: msg.message,
//               lastMessageTime: msg.timestamp,
//               unreadCount: 0,
//               originalChatId: msg.chatId || msg.userEmail || chatId
//             };
//           }
          
//           // ✅ Check for duplicates
//           const exists = newConversations[chatId].messages.some(m => m.id === key);
//           if (!exists) {
//             newConversations[chatId].messages.push({ id: key, ...msg });
//           }
          
//           if (msg.timestamp > newConversations[chatId].lastMessageTime) {
//             newConversations[chatId].lastMessage = msg.message;
//             newConversations[chatId].lastMessageTime = msg.timestamp;
//           }
//         });
        
//         Object.keys(newConversations).forEach((chatId) => {
//           newConversations[chatId].unreadCount = newConversations[chatId].messages.filter(
//             msg => !msg.isAdmin && !msg.isRead
//           ).length;
//         });
        
//         setConversations(newConversations);
//         console.log(`🔄 Refreshed: ${Object.keys(newConversations).length} conversations`);
//       }
//     } catch (error) {
//       console.error('Error refreshing:', error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   // ✅ Get display name
//   const getDisplayName = (conv) => {
//     if (conv.userEmail) return conv.userEmail;
//     if (conv.userPhone) return conv.userPhone;
//     if (conv.userName && conv.userName !== 'Guest') return conv.userName;
//     return 'Guest';
//   };

//   const getIdentifier = (conv) => {
//     if (conv.userEmail) {
//       return { type: 'email', value: conv.userEmail, icon: <Mail className="w-3 h-3" /> };
//     }
//     if (conv.userPhone) {
//       return { type: 'phone', value: conv.userPhone, icon: <Phone className="w-3 h-3" /> };
//     }
//     return { type: 'none', value: 'No contact info', icon: null };
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-[#8B5E3C]">
//             💬 Support Dashboard
//           </h1>
//           <button
//             onClick={refreshConversations}
//             disabled={refreshing}
//             className="bg-[#8B5E3C] text-white px-4 py-2 rounded-lg hover:bg-[#7A4F32] transition flex items-center gap-2 disabled:opacity-50"
//           >
//             <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
//             Refresh
//           </button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Conversations List */}
//           <div className="lg:col-span-1 bg-white rounded-xl shadow-lg">
//             <div className="p-4 bg-[#8B5E3C] text-white rounded-t-xl">
//               <h2 className="font-bold">Conversations</h2>
//               <p className="text-sm opacity-90">{Object.keys(conversations).length} chats</p>
//             </div>
//             <div className="h-[600px] overflow-y-auto">
//               {Object.values(conversations).length === 0 ? (
//                 <div className="p-8 text-center text-gray-400">
//                   <MessageCircle className="w-12 h-12 mx-auto mb-3" />
//                   <p>No conversations yet</p>
//                   <p className="text-sm">Send a test message from the website</p>
//                 </div>
//               ) : (
//                 Object.values(conversations)
//                   .sort((a, b) => b.lastMessageTime - a.lastMessageTime)
//                   .map((conv) => {
//                     const displayName = getDisplayName(conv);
//                     const identifier = getIdentifier(conv);
                    
//                     return (
//                       <div
//                         key={conv.chatId}
//                         onClick={() => loadChatMessages(conv.chatId)}
//                         className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition ${
//                           selectedChatId === conv.chatId ? 'bg-[#F5EDE6]' : ''
//                         }`}
//                       >
//                         <div className="flex justify-between items-start">
//                           <div className="flex-1 min-w-0">
//                             <h3 className="font-semibold text-gray-800 flex items-center gap-1.5 truncate">
//                               {identifier.icon}
//                               <span className="truncate">{displayName}</span>
//                             </h3>
                            
//                             {conv.userName && conv.userName !== 'Guest' && conv.userName !== displayName && (
//                               <p className="text-xs text-gray-400 truncate">
//                                 {conv.userName}
//                               </p>
//                             )}
                            
//                             <p className="text-sm text-gray-600 truncate mt-1">
//                               {conv.lastMessage}
//                             </p>
//                             <p className="text-xs text-gray-400 mt-1">
//                               {new Date(conv.lastMessageTime).toLocaleString()}
//                             </p>
//                           </div>
//                           {conv.unreadCount > 0 && (
//                             <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2">
//                               {conv.unreadCount}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })
//               )}
//             </div>
//           </div>

//           {/* Chat Area */}
//           <div className="lg:col-span-2 bg-white rounded-xl shadow-lg flex flex-col h-[700px]">
//             {selectedChatId && conversations[selectedChatId] ? (
//               <>
//                 <div className="p-4 border-b bg-gray-50 rounded-t-xl">
//                   <h3 className="font-bold text-gray-800">
//                     {getDisplayName(conversations[selectedChatId])}
//                   </h3>
//                   {conversations[selectedChatId].userName && 
//                    conversations[selectedChatId].userName !== 'Guest' && 
//                    conversations[selectedChatId].userName !== getDisplayName(conversations[selectedChatId]) && (
//                     <p className="text-sm text-gray-500">
//                       Name: {conversations[selectedChatId].userName}
//                     </p>
//                   )}
//                   {conversations[selectedChatId].userEmail && (
//                     <p className="text-sm text-gray-500 flex items-center gap-1">
//                       <Mail className="w-3 h-3" />
//                       {conversations[selectedChatId].userEmail}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
//                   {messages.length === 0 ? (
//                     <div className="text-center text-gray-400 mt-10">
//                       <MessageCircle className="w-12 h-12 mx-auto mb-3" />
//                       <p>No messages</p>
//                     </div>
//                   ) : (
//                     messages.map((msg) => (
//                       <div
//                         key={msg.id}
//                         className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
//                       >
//                         <div
//                           className={`max-w-[70%] p-3 rounded-2xl ${
//                             msg.isAdmin 
//                               ? 'bg-gray-200 rounded-tl-none' 
//                               : 'bg-[#8B5E3C] text-white rounded-tr-none'
//                           }`}
//                         >
//                           {msg.isAdmin && (
//                             <p className="text-xs font-semibold text-[#8B5E3C] mb-1">M&M Scents Team</p>
//                           )}
//                           <p className="text-sm">{msg.message}</p>
//                           <span className={`text-[10px] mt-1 block ${msg.isAdmin ? 'text-gray-500' : 'text-white/70'}`}>
//                             {new Date(msg.timestamp).toLocaleTimeString()}
//                           </span>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>

//                 <form onSubmit={sendReply} className="p-4 border-t bg-white">
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={reply}
//                       onChange={(e) => setReply(e.target.value)}
//                       placeholder="Type your reply..."
//                       className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
//                       disabled={loading}
//                     />
//                     <button
//                       type="submit"
//                       className="bg-[#8B5E3C] text-white px-6 py-2 rounded-lg hover:bg-[#7A4F32] transition flex items-center gap-2 disabled:opacity-50"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <>
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                           Sending...
//                         </>
//                       ) : (
//                         <>
//                           <Send className="w-4 h-4" />
//                           Reply
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </>
//             ) : (
//               <div className="flex-1 flex items-center justify-center text-gray-400">
//                 <div className="text-center">
//                   <MessageCircle className="w-16 h-16 mx-auto mb-4" />
//                   <p>Select a conversation</p>
//                   <p className="text-sm">Send a test message from the website</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// app/admin/support/page.jsx
// app/admin/support/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { rtdb } from '@/lib/firebase';
import { ref, onChildAdded, push, set, get, update } from 'firebase/database';
import { Send, MessageCircle, Mail, Phone, RefreshCw, ArrowLeft, User, Clock, CheckCheck } from 'lucide-react';
import Link from 'next/link';

export default function SupportDashboard() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState({});
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
    }
  }, [isAdmin]);

  // ✅ Encode chat ID
  const encodeChatId = (id) => {
    if (!id) return 'guest_' + Date.now();
    return id.toString().replace(/[.#$[\]/@]/g, '_');
  };

  // ✅ Load all messages
  useEffect(() => {
    console.log('📡 Listening to all_messages...');
    const allMessagesRef = ref(rtdb, 'all_messages');
    
    const unsubscribe = onChildAdded(allMessagesRef, async (snapshot) => {
      const data = snapshot.val();
      
      let chatId = data.chatId || data.userEmail || data.userId;
      
      if (!chatId) {
        console.warn('⚠️ No chatId found:', data);
        return;
      }

      chatId = encodeChatId(chatId);
      
      console.log('📩 New message for chat:', chatId);
      
      setConversations(prev => {
        const existing = prev[chatId] || {
          chatId: chatId,
          userEmail: data.userEmail || null,
          userName: data.userName || 'Guest',
          userPhone: data.userPhone || null,
          messages: [],
          lastMessage: data.message,
          lastMessageTime: data.timestamp,
          unreadCount: 0,
          originalChatId: data.chatId || data.userEmail || chatId
        };
        
        // ✅ Check if message already exists
        const messageExists = existing.messages.some(msg => msg.id === snapshot.key);
        if (!messageExists) {
          existing.messages.push({ id: snapshot.key, ...data });
        }
        
        existing.lastMessage = data.message;
        existing.lastMessageTime = data.timestamp;
        
        // ✅ Calculate unread count (only non-admin, unread messages)
        existing.unreadCount = existing.messages.filter(
          msg => !msg.isAdmin && !msg.isRead
        ).length;
        
        return { ...prev, [chatId]: existing };
      });
    });

    return () => unsubscribe();
  }, []);

  // ✅ Load messages for selected chat and mark as read
  const loadChatMessages = async (chatId) => {
    const conv = conversations[chatId];
    if (conv) {
      setMessages(conv.messages || []);
      setSelectedChatId(chatId);
      console.log(`📨 Loaded ${conv.messages.length} messages for ${chatId}`);
      
      // ✅ Mark all messages as read
      await markMessagesAsRead(chatId);
    }
  };

  // ✅ Mark messages as read in Firebase
  const markMessagesAsRead = async (chatId) => {
    try {
      const conv = conversations[chatId];
      if (!conv) return;

      // ✅ Get all unread messages (non-admin, not read)
      const unreadMessages = conv.messages.filter(msg => !msg.isAdmin && !msg.isRead);
      
      if (unreadMessages.length === 0) return;

      console.log(`📖 Marking ${unreadMessages.length} messages as read for ${chatId}`);

      // ✅ Update each unread message in Firebase
      for (const msg of unreadMessages) {
        const msgRef = ref(rtdb, `all_messages/${msg.id}`);
        await update(msgRef, { isRead: true });
      }

      // ✅ Update local state
      setConversations(prev => {
        const updated = { ...prev };
        if (updated[chatId]) {
          // Update messages in conversation
          updated[chatId].messages = updated[chatId].messages.map(msg => {
            if (!msg.isAdmin && !msg.isRead) {
              return { ...msg, isRead: true };
            }
            return msg;
          });
          updated[chatId].unreadCount = 0;
        }
        return updated;
      });

      // ✅ Update current messages view
      setMessages(prev => prev.map(msg => {
        if (!msg.isAdmin && !msg.isRead) {
          return { ...msg, isRead: true };
        }
        return msg;
      }));

    } catch (error) {
      console.error('❌ Error marking messages as read:', error);
    }
  };

  // ✅ Send reply
  const sendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    if (!selectedChatId) {
      alert('Please select a conversation first');
      return;
    }

    setLoading(true);

    const conversation = conversations[selectedChatId];
    const encodedChatId = encodeChatId(selectedChatId);
    
    const messageData = {
      chatId: encodedChatId,
      userEmail: conversation.userEmail || null,
      userName: 'M&M Scents Team',
      userPhone: conversation.userPhone || null,
      message: reply.trim(),
      isAdmin: true,
      timestamp: Date.now(),
      isRead: true
    };

    console.log('📤 Sending reply to:', encodedChatId);

    try {
      const userChatRef = ref(rtdb, `chats/${encodedChatId}/messages`);
      const newMsgRef = await push(userChatRef, messageData);
      
      const allMessagesRef = ref(rtdb, `all_messages/${newMsgRef.key}`);
      await set(allMessagesRef, {
        ...messageData,
        id: newMsgRef.key
      });

      setReply('');
      console.log('✅ Reply sent to:', encodedChatId);
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Failed to send reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refresh conversations
  const refreshConversations = async () => {
    setRefreshing(true);
    try {
      const allMessagesRef = ref(rtdb, 'all_messages');
      const snapshot = await get(allMessagesRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const newConversations = {};
        
        Object.keys(data).forEach((key) => {
          const msg = data[key];
          let chatId = msg.chatId || msg.userEmail || msg.userId;
          
          if (!chatId) return;
          
          chatId = encodeChatId(chatId);
          
          if (!newConversations[chatId]) {
            newConversations[chatId] = {
              chatId: chatId,
              userEmail: msg.userEmail || null,
              userName: msg.userName || 'Guest',
              userPhone: msg.userPhone || null,
              messages: [],
              lastMessage: msg.message,
              lastMessageTime: msg.timestamp,
              unreadCount: 0,
              originalChatId: msg.chatId || msg.userEmail || chatId
            };
          }
          
          const exists = newConversations[chatId].messages.some(m => m.id === key);
          if (!exists) {
            newConversations[chatId].messages.push({ id: key, ...msg });
          }
          
          if (msg.timestamp > newConversations[chatId].lastMessageTime) {
            newConversations[chatId].lastMessage = msg.message;
            newConversations[chatId].lastMessageTime = msg.timestamp;
          }
        });
        
        // ✅ Calculate unread count for each conversation
        Object.keys(newConversations).forEach((chatId) => {
          newConversations[chatId].unreadCount = newConversations[chatId].messages.filter(
            msg => !msg.isAdmin && !msg.isRead
          ).length;
        });
        
        setConversations(newConversations);
        console.log(`🔄 Refreshed: ${Object.keys(newConversations).length} conversations`);
      }
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ Get display name
  const getDisplayName = (conv) => {
    if (conv.userEmail) return conv.userEmail;
    if (conv.userPhone) return conv.userPhone;
    if (conv.userName && conv.userName !== 'Guest') return conv.userName;
    return 'Guest';
  };

  const getIdentifier = (conv) => {
    if (conv.userEmail) {
      return { type: 'email', value: conv.userEmail, icon: <Mail className="w-3 h-3" /> };
    }
    if (conv.userPhone) {
      return { type: 'phone', value: conv.userPhone, icon: <Phone className="w-3 h-3" /> };
    }
    return { type: 'none', value: 'No contact info', icon: null };
  };

  // ✅ Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-gray-600 hover:text-[#8B5E3C] transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-[#8B5E3C] flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Support Inbox
              </h1>
            </div>
            <button
              onClick={refreshConversations}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-[#8B5E3C] text-white rounded-lg hover:bg-[#7A4F32] transition disabled:opacity-50 text-sm font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
            <div className="p-4 bg-gradient-to-r from-[#8B5E3C] to-[#6B4A2E] text-white flex items-center justify-between">
              <div>
                <h2 className="font-bold">Conversations</h2>
                <p className="text-xs opacity-80">{Object.keys(conversations).length} chats</p>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                {Object.values(conversations).filter(c => c.unreadCount > 0).length} unread
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {Object.values(conversations).length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No conversations yet</p>
                  <p className="text-sm">Send a test message from the website</p>
                </div>
              ) : (
                Object.values(conversations)
                  .sort((a, b) => b.lastMessageTime - a.lastMessageTime)
                  .map((conv) => {
                    const displayName = getDisplayName(conv);
                    const identifier = getIdentifier(conv);
                    const hasUnread = conv.unreadCount > 0;
                    
                    return (
                      <div
                        key={conv.chatId}
                        onClick={() => loadChatMessages(conv.chatId)}
                        className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                          selectedChatId === conv.chatId ? 'bg-[#F5EDE6] border-l-4 border-[#8B5E3C]' : 'hover:pl-5'
                        } ${hasUnread ? 'bg-blue-50/50' : ''}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold truncate flex items-center gap-1.5 text-sm ${hasUnread ? 'text-[#8B5E3C]' : 'text-gray-800'}`}>
                              {identifier.icon}
                              <span className="truncate">{displayName}</span>
                              {hasUnread && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full inline-block flex-shrink-0 animate-pulse"></span>
                              )}
                            </h3>
                            
                            {conv.userName && conv.userName !== 'Guest' && conv.userName !== displayName && (
                              <p className="text-xs text-gray-400 truncate">{conv.userName}</p>
                            )}
                            
                            <p className={`text-sm truncate mt-1 ${hasUnread ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                              {conv.lastMessage}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(conv.lastMessageTime).toLocaleString()}
                            </p>
                          </div>
                          {hasUnread && (
                            <span className="bg-blue-500 text-white text-xs px-2.5 py-1 rounded-full flex-shrink-0 ml-2 font-semibold animate-pulse">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
            {selectedChatId && conversations[selectedChatId] ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-gray-50 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <User className="w-4 h-4 text-[#8B5E3C]" />
                      {getDisplayName(conversations[selectedChatId])}
                    </h3>
                    {conversations[selectedChatId].userName && 
                     conversations[selectedChatId].userName !== 'Guest' && 
                     conversations[selectedChatId].userName !== getDisplayName(conversations[selectedChatId]) && (
                      <p className="text-sm text-gray-500">Name: {conversations[selectedChatId].userName}</p>
                    )}
                    {conversations[selectedChatId].userEmail && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {conversations[selectedChatId].userEmail}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {messages.length} messages
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">No messages</p>
                      <p className="text-sm">Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                            msg.isAdmin 
                              ? 'bg-[#8B5E3C] text-white rounded-tr-none' 
                              : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                          } ${!msg.isAdmin && !msg.isRead ? 'border-blue-300 border-2' : ''}`}
                        >
                          {!msg.isAdmin && msg.userName && msg.userName !== 'Guest' && (
                            <p className="text-xs font-semibold text-[#8B5E3C] mb-1">{msg.userName}</p>
                          )}
                          <p className="text-sm break-words">{msg.message}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 ${
                            msg.isAdmin ? 'text-white/70' : 'text-gray-400'
                          }`}>
                            <span className="text-[10px]">{formatTime(msg.timestamp)}</span>
                            {msg.isAdmin && <CheckCheck className="w-3 h-3" />}
                            {!msg.isAdmin && msg.isRead && <CheckCheck className="w-3 h-3 text-green-500" />}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Reply Input */}
                <form onSubmit={sendReply} className="p-4 border-t bg-white flex-shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent transition text-sm"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      className="bg-[#8B5E3C] text-white px-6 py-2.5 rounded-xl hover:bg-[#7A4F32] transition flex items-center gap-2 disabled:opacity-50 font-medium"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium text-gray-500">Select a conversation</p>
                  <p className="text-sm">Click on a chat from the left panel to start replying</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}