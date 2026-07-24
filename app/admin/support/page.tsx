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
import { Send, MessageCircle, RefreshCw, ArrowLeft, Clock, CheckCheck, Search, ChevronLeft, X } from 'lucide-react';
import Link from 'next/link';

interface MessageType {
  id: string;
  chatId: string;
  userEmail: string | null;
  userName: string;
  userPhone: string | null;
  message: string;
  isAdmin: boolean;
  timestamp: number;
  isRead: boolean;
}

interface ConversationType {
  chatId: string;
  userEmail: string | null;
  userName: string;
  userPhone: string | null;
  messages: MessageType[];
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
  originalChatId: string;
}

export default function SupportDashboard() {
  const { isAdmin } = useAuth() as any;
  
  const router = useRouter();
  const [conversations, setConversations] = useState<Record<string, ConversationType>>({});
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowChat(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
    }
  }, [isAdmin, router]);

  // ✅ Encode chat ID
  const encodeChatId = (id: string): string => {
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
          lastMessage: data.message || '',
          lastMessageTime: data.timestamp || Date.now(),
          unreadCount: 0,
          originalChatId: data.chatId || data.userEmail || chatId
        };
        
        const messageExists = existing.messages.some((msg: MessageType) => msg.id === snapshot.key);
        if (!messageExists) {
          existing.messages.push({ 
            id: snapshot.key, 
            ...data,
            isRead: data.isRead || false,
            isAdmin: data.isAdmin || false,
            timestamp: data.timestamp || Date.now()
          } as MessageType);
        }
        
        existing.lastMessage = data.message || existing.lastMessage;
        existing.lastMessageTime = data.timestamp || existing.lastMessageTime;
        existing.unreadCount = existing.messages.filter(
          (msg: MessageType) => !msg.isAdmin && !msg.isRead
        ).length;
        
        return { ...prev, [chatId]: existing };
      });
    });

    return () => unsubscribe();
  }, []);

  // ✅ Load messages for selected chat and mark as read
  const loadChatMessages = async (chatId: string) => {
    const conv = conversations[chatId];
    if (conv) {
      setMessages(conv.messages || []);
      setSelectedChatId(chatId);
      setShowChat(true);
      console.log(`📨 Loaded ${conv.messages.length} messages for ${chatId}`);
      await markMessagesAsRead(chatId);
    }
  };

  // ✅ Mark messages as read
  const markMessagesAsRead = async (chatId: string) => {
    try {
      const conv = conversations[chatId];
      if (!conv) return;

      const unreadMessages = conv.messages.filter((msg: MessageType) => !msg.isAdmin && !msg.isRead);
      
      if (unreadMessages.length === 0) return;

      for (const msg of unreadMessages) {
        const msgRef = ref(rtdb, `all_messages/${msg.id}`);
        await update(msgRef, { isRead: true });
      }

      setConversations(prev => {
        const updated = { ...prev };
        if (updated[chatId]) {
          updated[chatId].messages = updated[chatId].messages.map((msg: MessageType) => {
            if (!msg.isAdmin && !msg.isRead) {
              return { ...msg, isRead: true };
            }
            return msg;
          });
          updated[chatId].unreadCount = 0;
        }
        return updated;
      });

      setMessages(prev => prev.map((msg: MessageType) => {
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
  const sendReply = async (e: React.FormEvent) => {
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

    try {
      const userChatRef = ref(rtdb, `chats/${encodedChatId}/messages`);
      const newMsgRef = await push(userChatRef, messageData);
      
      const allMessagesRef = ref(rtdb, `all_messages/${newMsgRef.key}`);
      await set(allMessagesRef, {
        ...messageData,
        id: newMsgRef.key
      });

      setReply('');
      
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
        const newConversations: Record<string, ConversationType> = {};
        
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
              lastMessage: msg.message || '',
              lastMessageTime: msg.timestamp || Date.now(),
              unreadCount: 0,
              originalChatId: msg.chatId || msg.userEmail || chatId
            };
          }
          
          const exists = newConversations[chatId].messages.some((m: MessageType) => m.id === key);
          if (!exists) {
            newConversations[chatId].messages.push({ 
              id: key, 
              ...msg,
              isRead: msg.isRead || false,
              isAdmin: msg.isAdmin || false,
              timestamp: msg.timestamp || Date.now()
            } as MessageType);
          }
          
          if (msg.timestamp > newConversations[chatId].lastMessageTime) {
            newConversations[chatId].lastMessage = msg.message || '';
            newConversations[chatId].lastMessageTime = msg.timestamp || Date.now();
          }
        });
        
        Object.keys(newConversations).forEach((chatId) => {
          newConversations[chatId].unreadCount = newConversations[chatId].messages.filter(
            (msg: MessageType) => !msg.isAdmin && !msg.isRead
          ).length;
        });
        
        setConversations(newConversations);
      }
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ Go back to conversations list (mobile)
  const handleBack = () => {
    setShowChat(false);
    setSelectedChatId(null);
  };

  // ✅ Get display name
  const getDisplayName = (conv: ConversationType): string => {
    if (conv.userEmail) return conv.userEmail;
    if (conv.userPhone) return conv.userPhone;
    if (conv.userName && conv.userName !== 'Guest') return conv.userName;
    return 'Guest';
  };

  // ✅ Format time
  const formatTime = (timestamp: number): string => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ✅ Filter conversations by search
  const filteredConversations = Object.values(conversations).filter((conv) => {
    const displayName = getDisplayName(conv);
    return displayName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-100 overflow-hidden">
      {/* ✅ Header - Fixed */}
      <div className="bg-[#075E54] text-white sticky top-0 z-20 shadow-md flex-shrink-0">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {isMobile && showChat ? (
                <button
                  onClick={handleBack}
                  className="hover:bg-white/10 p-1.5 rounded-full transition flex-shrink-0"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              ) : (
                <Link
                  href="/admin"
                  className="hover:bg-white/10 p-1.5 rounded-full transition flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              )}
              <h1 className="text-lg font-semibold truncate">
                {isMobile && showChat && selectedChatId ? (
                  <span className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {getDisplayName(conversations[selectedChatId])?.charAt(0).toUpperCase() || '?'}
                    </span>
                    <span className="truncate">{getDisplayName(conversations[selectedChatId])}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">Support Inbox</span>
                  </span>
                )}
              </h1>
            </div>
            {!isMobile && (
              <button
                onClick={refreshConversations}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition disabled:opacity-50 text-sm font-medium flex-shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Main Content */}
      <div className="h-[calc(100vh-64px)] overflow-hidden">
        <div className="flex h-full overflow-hidden">
          {/* ✅ Conversations List - Left Panel */}
          <div className={`${isMobile && showChat ? 'hidden' : 'flex'} flex-col w-full lg:w-1/3 bg-white border-r border-gray-200 h-full overflow-hidden`}>
            {/* ✅ Search - Fixed */}
            <div className="p-3 bg-[#075E54] text-white flex-shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search or start new chat"
                  className="w-full px-3 py-1.5 bg-white/20 rounded-lg text-white placeholder-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 pr-8"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm opacity-80">
                  {filteredConversations.length} conversations
                </span>
                {isMobile && (
                  <button
                    onClick={refreshConversations}
                    disabled={refreshing}
                    className="text-white/80 hover:text-white text-sm flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                )}
              </div>
            </div>

            {/* Conversations List - Scrollable */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No conversations yet</p>
                  <p className="text-sm">Send a test message from the website</p>
                </div>
              ) : (
                filteredConversations
                  .sort((a, b) => b.lastMessageTime - a.lastMessageTime)
                  .map((conv) => {
                    const displayName = getDisplayName(conv);
                    const hasUnread = conv.unreadCount > 0;
                    
                    return (
                      <div
                        key={conv.chatId}
                        onClick={() => loadChatMessages(conv.chatId)}
                        className={`flex items-center gap-3 p-3 border-b hover:bg-gray-100 cursor-pointer transition ${
                          selectedChatId === conv.chatId ? 'bg-gray-100' : ''
                        } ${hasUnread ? 'bg-blue-50' : ''}`}
                      >
                        <div className="w-12 h-12 rounded-full bg-[#075E54] text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className={`font-semibold truncate ${hasUnread ? 'text-[#075E54]' : 'text-gray-800'}`}>
                              {displayName}
                            </h3>
                            <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                              {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className={`text-sm truncate flex-1 ${hasUnread ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                              {conv.lastMessage}
                            </p>
                            {hasUnread && (
                              <span className="bg-[#25D366] text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2 min-w-[20px] text-center">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* ✅ Chat Area - Right Panel (WhatsApp Style) */}
          <div className={`${isMobile && !showChat ? 'hidden' : 'flex'} flex-1 flex-col bg-white h-full overflow-hidden`}>
            {selectedChatId && conversations[selectedChatId] ? (
              <>
                {/* ✅ Chat Header - Desktop Only (Mobile par hide) */}
                {!isMobile && (
                  <div className="bg-[#075E54] text-white px-4 py-2.5 flex items-center gap-2 flex-shrink-0 z-10 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center text-base font-bold flex-shrink-0">
                      {getDisplayName(conversations[selectedChatId])?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">
                        {getDisplayName(conversations[selectedChatId])}
                      </h3>
                      <p className="text-[10px] text-green-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse"></span>
                        Online
                      </p>
                    </div>
                  </div>
                )}

                {/* ✅ Messages - Scrollable ONLY */}
                <div 
                  className="flex-1 overflow-y-auto p-3 space-y-1.5"
                  style={{ 
                    backgroundColor: '#ECE5DD',
                    backgroundImage: 'radial-gradient(circle at 10px 10px, #d4c9b8 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
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
                          className={`max-w-[75%] p-2.5 px-3.5 rounded-lg shadow-sm ${
                            msg.isAdmin 
                              ? 'bg-[#DCF8C6] rounded-tr-none' 
                              : 'bg-white rounded-tl-none'
                          } ${!msg.isAdmin && !msg.isRead ? 'border-2 border-[#25D366]' : ''}`}
                        >
                          {msg.isAdmin ? (
                            <p className="text-xs font-semibold text-[#075E54] mb-0.5">You</p>
                          ) : (
                            <p className="text-xs font-semibold text-[#075E54] mb-0.5">{msg.userName || 'User'}</p>
                          )}
                          <p className="text-sm break-words">{msg.message}</p>
                          <div className={`text-[9px] mt-0.5 flex items-center justify-end gap-0.5 ${
                            msg.isAdmin ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            <span>{formatTime(msg.timestamp)}</span>
                            {msg.isAdmin && (
                              <span className="text-[#075E54]">✓✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* ✅ Input - FIXED (Never moves) */}
                <div className="bg-[#F0F0F0] px-3 py-2 flex-shrink-0 border-t border-gray-200">
                  <form onSubmit={sendReply} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2.5 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#075E54] text-sm border border-gray-200 min-w-0"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      className={`bg-[#075E54] text-white p-2.5 rounded-full hover:bg-[#054740] transition w-11 h-11 flex items-center justify-center flex-shrink-0 ${
                        !reply.trim() || loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={!reply.trim() || loading}
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
                <div className="text-center p-4">
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