// // components/SupportChat.jsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { MessageCircle, X, Send, Headphones } from 'lucide-react';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, onChildAdded, query, limitToLast, orderByChild, push, set, onValue, get, child } from 'firebase/database';

// export default function SupportChat() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const { user } = useAuth();
//   const messagesEndRef = useRef(null);
//   const [chatId, setChatId] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ Encode chat ID
//   const encodeChatId = (id) => {
//     if (!id) return 'guest_' + Date.now();
//     return id.toString().replace(/[.#$[\]/@]/g, '_');
//   };

//   // ✅ Get chat ID once and store it
//   useEffect(() => {
//     let id;
//     if (user && user.email) {
//       id = encodeChatId(user.email);
//     } else {
//       let sessionId = localStorage.getItem('supportSessionId');
//       if (!sessionId) {
//         sessionId = 'guest_' + Date.now();
//         localStorage.setItem('supportSessionId', sessionId);
//       }
//       id = encodeChatId(sessionId);
//     }
//     setChatId(id);
//     console.log('📌 Chat ID set to:', id);
//   }, [user]);

//   // ✅ Load messages - Load OLD + Listen for NEW
//   useEffect(() => {
//     if (!chatId) return;

//     console.log('📂 Loading messages for chat:', chatId);
//     setLoading(true);

//     const messagesRef = ref(rtdb, `chats/${chatId}/messages`);

//     // ✅ STEP 1: Load ALL existing messages first
//     const loadOldMessages = async () => {
//       try {
//         const snapshot = await get(messagesRef);
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           const loadedMessages = Object.keys(data).map((key) => ({
//             id: key,
//             ...data[key]
//           }));
          
//           // Sort by timestamp (oldest first)
//           loadedMessages.sort((a, b) => a.timestamp - b.timestamp);
          
//           console.log(`📨 Loaded ${loadedMessages.length} old messages`);
//           setMessages(loadedMessages);
//         } else {
//           console.log('📭 No old messages found');
//           setMessages([]);
//         }
//       } catch (error) {
//         console.error('❌ Error loading messages:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadOldMessages();

//     // ✅ STEP 2: Listen for NEW messages (real-time)
//     const newMessagesQuery = query(
//       ref(rtdb, `chats/${chatId}/messages`),
//       orderByChild('timestamp'),
//       limitToLast(100)
//     );

//     const unsubscribe = onChildAdded(newMessagesQuery, (snapshot) => {
//       const data = snapshot.val();
//       console.log('📩 New message received:', data);
      
//       setMessages(prev => {
//         // Check if message already exists
//         if (prev.some(msg => msg.id === snapshot.key)) return prev;
        
//         // Add new message and sort by timestamp
//         const newMessages = [...prev, { id: snapshot.key, ...data }];
//         newMessages.sort((a, b) => a.timestamp - b.timestamp);
//         return newMessages;
//       });
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, [chatId]);

//   // ✅ Scroll to bottom on new messages or when chat opens
//   useEffect(() => {
//     if (isOpen) {
//       setTimeout(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//       }, 100);
//     }
//   }, [messages, isOpen]);

//   // ✅ Get user display name
//   const getUserName = () => {
//     if (user) {
//       return user.name || user.displayName || user.email || 'Guest';
//     }
//     return 'Guest';
//   };

//   // ✅ Get original email
//   const getOriginalEmail = () => {
//     if (user && user.email) {
//       return user.email;
//     }
//     return null;
//   };

//   // ✅ Send message
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !chatId) return;

//     const messageData = {
//       chatId: chatId,
//       userEmail: getOriginalEmail(),
//       userName: getUserName(),
//       userPhone: user?.phone || null,
//       message: newMessage.trim(),
//       isAdmin: false,
//       timestamp: Date.now(),
//       isRead: false
//     };

//     console.log('📤 Sending message:', messageData);

//     try {
//       // ✅ Save to user's chat
//       const userChatRef = ref(rtdb, `chats/${chatId}/messages`);
//       const newMsgRef = await push(userChatRef, messageData);
      
//       // ✅ Save to all_messages for admin
//       const allMessagesRef = ref(rtdb, `all_messages/${newMsgRef.key}`);
//       await set(allMessagesRef, {
//         ...messageData,
//         id: newMsgRef.key
//       });

//       setNewMessage('');
//       console.log('✅ Message sent!');
      
//     } catch (error) {
//       console.error('❌ Error:', error);
//       alert('Failed to send message');
//     }
//   };

//   return (
//     <>
//       {/* Support Button */}
//       <motion.button
//         initial={{ scale: 0 }}
//         animate={{ scale: 1 }}
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={() => setIsOpen(true)}
//         className="fixed bottom-6 right-6 bg-[#8B5E3C] text-white p-4 rounded-full shadow-lg hover:bg-[#7A4F32] transition z-50 flex items-center gap-2"
//       >
//         <Headphones className="w-6 h-6" />
//         <span className="hidden sm:inline text-sm font-medium">Support</span>
//       </motion.button>

//       {/* Chat Modal */}
//       <AnimatePresence>
//         {isOpen && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 0.5 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsOpen(false)}
//               className="fixed inset-0 bg-black z-40"
//             />

//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 50 }}
//               className="fixed bottom-24 right-6 w-96 h-[550px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
//             >
//               {/* Header */}
//               <div className="bg-[#8B5E3C] text-white p-4">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h3 className="font-bold">M&M Scents Support</h3>
//                     <p className="text-xs opacity-90">We reply within minutes</p>
//                   </div>
//                   <button 
//                     onClick={() => setIsOpen(false)}
//                     className="hover:bg-white/20 p-1 rounded-lg"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               {/* Messages */}
//               <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
//                 {loading ? (
//                   <div className="text-center text-gray-500 mt-10">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B5E3C] mx-auto mb-3"></div>
//                     <p className="text-sm">Loading messages...</p>
//                   </div>
//                 ) : messages.length === 0 ? (
//                   <div className="text-center text-gray-500 mt-10">
//                     <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                     <p className="font-medium">Welcome! 👋</p>
//                     <p className="text-sm">How can we help you?</p>
//                   </div>
//                 ) : (
//                   messages.map((msg) => (
//                     <div
//                       key={msg.id}
//                       className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
//                     >
//                       <div
//                         className={`max-w-[75%] p-3 rounded-2xl ${
//                           msg.isAdmin 
//                             ? 'bg-white shadow rounded-tl-none border border-gray-100' 
//                             : 'bg-[#8B5E3C] text-white rounded-tr-none'
//                         }`}
//                       >
//                         {msg.isAdmin && (
//                           <p className="text-xs font-semibold text-[#8B5E3C] mb-1">M&M Scents Team</p>
//                         )}
//                         <p className="text-sm">{msg.message}</p>
//                         <span className={`text-[10px] mt-1 block ${msg.isAdmin ? 'text-gray-400' : 'text-white/70'}`}>
//                           {new Date(msg.timestamp).toLocaleTimeString()}
//                         </span>
//                       </div>
//                     </div>
//                   ))
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>

//               {/* Input */}
//               <form onSubmit={sendMessage} className="p-3 bg-white border-t">
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     placeholder="Type your message..."
//                     className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] text-sm"
//                   />
//                   <button
//                     type="submit"
//                     className="bg-[#8B5E3C] text-white p-2 rounded-full hover:bg-[#7A4F32] transition w-10 h-10 flex items-center justify-center"
//                   >
//                     <Send className="w-4 h-4" />
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }






























// components/SupportChat.jsx

// components/SupportChat.jsx
// components/SupportChat.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Headphones } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { rtdb } from '@/lib/firebase';
import { ref, onChildAdded, query, limitToLast, orderByChild, push, set, get } from 'firebase/database';

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleResize = () => {
      if (isMobile) {
        const heightDiff = window.innerHeight - window.outerHeight;
        setIsKeyboardOpen(heightDiff < -150);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  const encodeChatId = (id) => {
    if (!id) return 'guest_' + Date.now();
    return id.toString().replace(/[.#$[\]/@]/g, '_');
  };

  useEffect(() => {
    let id;
    if (user && user.email) {
      id = encodeChatId(user.email);
    } else {
      let sessionId = localStorage.getItem('supportSessionId');
      if (!sessionId) {
        sessionId = 'guest_' + Date.now();
        localStorage.setItem('supportSessionId', sessionId);
      }
      id = encodeChatId(sessionId);
    }
    setChatId(id);
  }, [user]);

  useEffect(() => {
    if (!chatId) return;

    setLoading(true);
    const messagesRef = ref(rtdb, `chats/${chatId}/messages`);

    const loadOldMessages = async () => {
      try {
        const snapshot = await get(messagesRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const loadedMessages = Object.keys(data).map((key) => ({
            id: key,
            ...data[key]
          }));
          loadedMessages.sort((a, b) => a.timestamp - b.timestamp);
          setMessages(loadedMessages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('❌ Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOldMessages();

    const newMessagesQuery = query(
      ref(rtdb, `chats/${chatId}/messages`),
      orderByChild('timestamp'),
      limitToLast(100)
    );

    const unsubscribe = onChildAdded(newMessagesQuery, (snapshot) => {
      const data = snapshot.val();
      setMessages(prev => {
        if (prev.some(msg => msg.id === snapshot.key)) return prev;
        const newMessages = [...prev, { id: snapshot.key, ...data }];
        newMessages.sort((a, b) => a.timestamp - b.timestamp);
        return newMessages;
      });
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 200);
    }
  }, [messages, isOpen]);

  const getUserName = () => {
    if (user) {
      return user.name || user.displayName || user.email || 'Guest';
    }
    return 'Guest';
  };

  const getOriginalEmail = () => {
    if (user && user.email) {
      return user.email;
    }
    return null;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    const messageData = {
      chatId: chatId,
      userEmail: getOriginalEmail(),
      userName: getUserName(),
      userPhone: user?.phone || null,
      message: newMessage.trim(),
      isAdmin: false,
      timestamp: Date.now(),
      isRead: false
    };

    try {
      const userChatRef = ref(rtdb, `chats/${chatId}/messages`);
      const newMsgRef = await push(userChatRef, messageData);
      
      const allMessagesRef = ref(rtdb, `all_messages/${newMsgRef.key}`);
      await set(allMessagesRef, {
        ...messageData,
        id: newMsgRef.key
      });

      setNewMessage('');
      
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Failed to send message');
    }
  };

  return (
    <>
      {/* Support Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#1DA851] transition z-50 flex items-center gap-2"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden sm:inline text-sm font-medium">Chat</span>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* ✅ Modal Container - RIGHT SIDE ON PC */}
            <div 
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-end p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsOpen(false);
              }}
            >
              <div 
                className="bg-white rounded-2xl shadow-2xl flex flex-col w-full sm:w-[400px] max-w-[450px] transition-all duration-300"
                style={{
                  height: isMobile ? (isKeyboardOpen ? '70vh' : '85vh') : '580px',
                  maxHeight: isMobile ? (isKeyboardOpen ? '70vh' : '90vh') : '90vh',
                }}
              >
                {/* HEADER */}
                <div className="bg-[#075E54] text-white px-4 py-3 flex-shrink-0 rounded-t-2xl relative z-10">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">M&M Scents Support</h3>
                        <p className="text-[10px] text-green-300 flex items-center gap-1">
                          Replies as soon as possible ⭐
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-white/10 p-1.5 rounded-full transition flex-shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* MESSAGES */}
                <div 
                  className="flex-1 overflow-y-auto p-3 space-y-2 transition-all duration-300"
                  style={{ 
                    backgroundColor: '#ECE5DD',
                    backgroundImage: 'radial-gradient(circle at 10px 10px, #d4c9b8 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    WebkitOverflowScrolling: 'touch',
                    minHeight: '100px',
                  }}
                >
                  {loading ? (
                    <div className="text-center text-gray-500 mt-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#075E54] mx-auto mb-3"></div>
                      <p className="text-sm">Loading messages...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium text-gray-600">Welcome! 👋</p>
                      <p className="text-sm text-gray-500">How can we help you?</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[75%] p-2.5 px-3.5 rounded-lg shadow-sm ${
                            msg.isAdmin 
                              ? 'bg-white rounded-tl-none' 
                              : 'bg-[#DCF8C6] rounded-tr-none'
                          }`}
                        >
                          {msg.isAdmin && (
                            <p className="text-xs font-semibold text-[#075E54] mb-0.5">M&M Scents Team</p>
                          )}
                          <p className="text-sm break-words">{msg.message}</p>
                          <div className={`text-[9px] mt-0.5 flex items-center justify-end gap-0.5 ${
                            msg.isAdmin ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {!msg.isAdmin && <span className="text-[#075E54]">✓✓</span>}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* INPUT */}
                <div 
                  className="bg-[#F0F0F0] px-3 py-2 flex-shrink-0 border-t border-gray-200 rounded-b-2xl transition-all duration-300"
                  style={{
                    transform: isKeyboardOpen ? 'translateY(-30px)' : 'translateY(0)',
                  }}
                >
                  <form onSubmit={sendMessage} className="flex gap-2 items-center">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2.5 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#075E54] text-sm border border-gray-200"
                      onFocus={() => {
                        setIsKeyboardOpen(true);
                        setTimeout(() => {
                          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                        }, 300);
                      }}
                      onBlur={() => {
                        setIsKeyboardOpen(false);
                      }}
                    />
                    <button
                      type="submit"
                      className={`bg-[#075E54] text-white p-2.5 rounded-full hover:bg-[#054740] transition w-11 h-11 flex items-center justify-center flex-shrink-0 ${
                        !newMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 