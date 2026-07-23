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
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Encode chat ID
  const encodeChatId = (id) => {
    if (!id) return 'guest_' + Date.now();
    return id.toString().replace(/[.#$[\]/@]/g, '_');
  };

  // ✅ Get chat ID once and store it
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
    console.log('📌 Chat ID set to:', id);
  }, [user]);

  // ✅ Load messages - Load OLD + Listen for NEW
  useEffect(() => {
    if (!chatId) return;

    console.log('📂 Loading messages for chat:', chatId);
    setLoading(true);

    const messagesRef = ref(rtdb, `chats/${chatId}/messages`);

    // ✅ STEP 1: Load ALL existing messages first
    const loadOldMessages = async () => {
      try {
        const snapshot = await get(messagesRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const loadedMessages = Object.keys(data).map((key) => ({
            id: key,
            ...data[key]
          }));
          
          // Sort by timestamp (oldest first)
          loadedMessages.sort((a, b) => a.timestamp - b.timestamp);
          
          console.log(`📨 Loaded ${loadedMessages.length} old messages`);
          setMessages(loadedMessages);
        } else {
          console.log('📭 No old messages found');
          setMessages([]);
        }
      } catch (error) {
        console.error('❌ Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOldMessages();

    // ✅ STEP 2: Listen for NEW messages (real-time)
    const newMessagesQuery = query(
      ref(rtdb, `chats/${chatId}/messages`),
      orderByChild('timestamp'),
      limitToLast(100)
    );

    const unsubscribe = onChildAdded(newMessagesQuery, (snapshot) => {
      const data = snapshot.val();
      console.log('📩 New message received:', data);
      
      setMessages(prev => {
        // Check if message already exists
        if (prev.some(msg => msg.id === snapshot.key)) return prev;
        
        // Add new message and sort by timestamp
        const newMessages = [...prev, { id: snapshot.key, ...data }];
        newMessages.sort((a, b) => a.timestamp - b.timestamp);
        return newMessages;
      });
    });

    return () => {
      unsubscribe();
    };
  }, [chatId]);

  // ✅ Scroll to bottom on new messages or when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isOpen]);

  // ✅ Get user display name
  const getUserName = () => {
    if (user) {
      return user.name || user.displayName || user.email || 'Guest';
    }
    return 'Guest';
  };

  // ✅ Get original email
  const getOriginalEmail = () => {
    if (user && user.email) {
      return user.email;
    }
    return null;
  };

  // ✅ Send message
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

    console.log('📤 Sending message:', messageData);

    try {
      // ✅ Save to user's chat
      const userChatRef = ref(rtdb, `chats/${chatId}/messages`);
      const newMsgRef = await push(userChatRef, messageData);
      
      // ✅ Save to all_messages for admin
      const allMessagesRef = ref(rtdb, `all_messages/${newMsgRef.key}`);
      await set(allMessagesRef, {
        ...messageData,
        id: newMsgRef.key
      });

      setNewMessage('');
      console.log('✅ Message sent!');
      
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
        className="fixed bottom-6 right-6 bg-[#8B5E3C] text-white p-4 rounded-full shadow-lg hover:bg-[#7A4F32] transition z-50 flex items-center gap-2"
      >
        <Headphones className="w-6 h-6" />
        <span className="hidden sm:inline text-sm font-medium">Support</span>
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

            {/* Chat Window - ✅ NEECHE KIYA HUA */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="
                fixed 
                bottom-0           /* ✅ Mobile par bilkul neeche */
                sm:bottom-10       /* ✅ Tablet par thora upar */
                md:bottom-16       /* ✅ Desktop par aur thora upar */
                right-0 
                sm:right-4 
                md:right-6
                w-full 
                sm:w-[380px] 
                md:w-[420px]
                h-[80vh]           /* ✅ Mobile par 80% height */
                sm:h-[500px] 
                md:h-[550px]
                bg-white 
                rounded-t-2xl      /* ✅ Mobile par sirf top rounded */
                sm:rounded-2xl     /* ✅ Desktop par sab rounded */
                shadow-2xl 
                z-50 
                flex flex-col 
                overflow-hidden
                sm:border 
                border-gray-200
              "
            >
              {/* Header */}
              <div className="bg-[#8B5E3C] text-white p-4 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">M&M Scents Support</h3>
                    <p className="text-xs opacity-90">We reply as soon as possible</p>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-white/20 p-1 rounded-lg transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {loading ? (
                  <div className="text-center text-gray-500 mt-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B5E3C] mx-auto mb-3"></div>
                    <p className="text-sm">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Welcome! 👋</p>
                    <p className="text-sm">How can we help you?</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.isAdmin 
                            ? 'bg-white shadow rounded-tl-none border border-gray-100' 
                            : 'bg-[#8B5E3C] text-white rounded-tr-none'
                        }`}
                      >
                        {msg.isAdmin && (
                          <p className="text-xs font-semibold text-[#8B5E3C] mb-1">M&M Scents Team</p>
                        )}
                        <p className="text-sm break-words">{msg.message}</p>
                        <span className={`text-[10px] mt-1 block ${msg.isAdmin ? 'text-gray-400' : 'text-white/70'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-3 bg-white border-t flex-shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-[#8B5E3C] text-white p-2 rounded-full hover:bg-[#7A4F32] transition w-10 h-10 flex items-center justify-center flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}