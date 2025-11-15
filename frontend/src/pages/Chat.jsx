// pages/Chat.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, FileText, Download, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import messageService from "@/services/message.service";
import { useToast } from "@/hooks/use-toast";
import { io } from "socket.io-client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";

const Chat = () => {
  const { id: conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize Socket.io connection
  useEffect(() => {
    try {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
      const newSocket = io(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        console.log('Connected to Socket.io with ID:', newSocket.id);
        if (conversationId) {
          newSocket.emit('joinRoom', conversationId);
          console.log(`Joined room: ${conversationId}`);
        }
      });

      newSocket.on('newMessage', (message) => {
        console.log('Received new message:', message);
        setMessages(prev => [...prev, message]);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to chat server. Please refresh the page.",
          variant: "destructive",
        });
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      setSocket(newSocket);

      return () => {
        console.log('Disconnecting socket');
        newSocket.disconnect();
      };
    } catch (error) {
      console.error('Error initializing socket:', error);
      toast({
        title: "Error",
        description: "Failed to initialize chat connection",
        variant: "destructive",
      });
    }
  }, [conversationId]);

  // Fetch conversation details and messages
  useEffect(() => {
    const fetchData = async () => {
      if (!conversationId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch messages
        const messagesResponse = await messageService.getMessages(conversationId);
        // Handle different response formats
        let messagesData = [];
        if (messagesResponse && messagesResponse.data) {
          messagesData = Array.isArray(messagesResponse.data) ? messagesResponse.data : [];
        } else if (messagesResponse) {
          messagesData = Array.isArray(messagesResponse) ? messagesResponse : [];
        }
        setMessages(messagesData);

        // Fetch all conversations to get the current one's details
        const conversationsResponse = await messageService.getUserConversations();
        // Handle different response formats
        let conversationsData = [];
        if (conversationsResponse && conversationsResponse.data) {
          conversationsData = Array.isArray(conversationsResponse.data) ? conversationsResponse.data : [];
        } else if (conversationsResponse) {
          conversationsData = Array.isArray(conversationsResponse) ? conversationsResponse : [];
        }
        
        const currentConv = conversationsData.find(c => (c._id || c.id) === conversationId) || null;
        setConversation(currentConv);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
        setConversation(null);
        if (error.response?.data?.message) {
          toast({
            title: "Error",
            description: `Failed to load messages: ${error.response.data.message}`,
            variant: "destructive",
          });
        } else if (error.message) {
          toast({
            title: "Error",
            description: `Failed to load messages: ${error.message}`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to load messages. Please try again later.",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [conversationId, toast]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !socket.connected) {
      if (!socket || !socket.connected) {
        toast({
          title: "Connection Error",
          description: "Not connected to chat server. Please refresh the page.",
          variant: "destructive",
        });
      }
      return;
    }

    try {
      // Send via Socket.io
      socket.emit('sendMessage', {
        conversationId,
        sender: user._id || user.id,
        text: newMessage,
        fileUrl: null,
      });

      // Add message to UI immediately (optimistic update)
      const tempMessage = {
        _id: Date.now().toString(),
        conversationId,
        sender: {
          _id: user._id || user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        text: newMessage,
        createdAt: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response?.data?.message) {
        toast({
          title: "Error",
          description: `Failed to send message: ${error.response.data.message}`,
          variant: "destructive",
        });
      } else if (error.message) {
        toast({
          title: "Error",
          description: `Failed to send message: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      // TODO: Implement file upload to Cloudinary
      toast({
        title: "Info",
        description: "File upload feature coming soon",
      });
    } catch (error) {
      console.error('Error handling file upload:', error);
      toast({
        title: "Error",
        description: "Failed to process file upload",
        variant: "destructive",
      });
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Unknown";
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getOtherParticipant = () => {
    if (!conversation || !user) return null;
    return conversation.participants?.find(p => (p._id || p.id) !== (user._id || user.id)) || 
           conversation.participants?.[0];
  };

  const otherUser = getOtherParticipant();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
        <Footer />
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Conversation not found</h2>
            <Button onClick={() => navigate('/messages')}>Go to Messages</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/messages')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Messages
        </Button>

        <div className="grid lg:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
          {/* Sidebar - Conversation Info */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <CardTitle>Conversation</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {conversation?.job && (
                  <div className="p-3 border rounded-lg bg-purple-50 border-purple-200">
                    <div className="font-semibold text-sm">{conversation.job.title || "Job"}</div>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Job-related
                    </Badge>
                  </div>
                )}
                {conversation?.contract && (
                  <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
                    <div className="font-semibold text-sm">Contract</div>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {conversation.contract.status || "Active"}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={otherUser?.profilePicture || otherUser?.avatar} />
                    <AvatarFallback className="bg-white text-purple-600">
                      {otherUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 
                       otherUser?.username?.substring(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{otherUser?.name || otherUser?.username || "Unknown User"}</CardTitle>
                    <div className="text-sm text-purple-100">
                      {otherUser?.role || "User"}
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((message) => {
                    const isCurrentUser = (message.sender?._id || message.sender?.id) === (user?._id || user?.id) || 
                                         message.sender === (user?._id || user?.id);
                    
                    return (
                      <div
                        key={message._id || message.id}
                        className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={isCurrentUser ? "bg-purple-600 text-white" : "bg-gray-300"}>
                            {isCurrentUser
                              ? (user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 
                                 user?.username?.substring(0, 2).toUpperCase() || "ME")
                              : (otherUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 
                                 otherUser?.username?.substring(0, 2).toUpperCase() || "U")
                            }
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className={`max-w-[70%] ${isCurrentUser ? "text-right" : "text-left"}`}>
                          {message.fileUrl ? (
                            <div className={`inline-flex items-center gap-2 p-3 border rounded-lg ${
                              isCurrentUser
                                ? "bg-purple-100 border-purple-200"
                                : "bg-muted border-muted-foreground/20"
                            }`}>
                              <FileText className="w-4 h-4" />
                              <div className="text-sm">
                                <div className="font-medium">{message.text || 'File'}</div>
                              </div>
                              <Button variant="ghost" size="sm" className="ml-2">
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className={`inline-block p-3 rounded-lg ${
                              isCurrentUser
                                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                                : "bg-muted"
                            }`}>
                              {message.text || "Empty message"}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatTime(message.createdAt || message.timestamp || message.created)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4 bg-white">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="pr-20"
                    />
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="file-upload"
                      className="absolute right-10 top-2.5 cursor-pointer"
                    >
                      <Paperclip className="w-5 h-5 text-muted-foreground" />
                    </label>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;