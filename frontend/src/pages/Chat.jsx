// pages/Chat.jsx
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, FileText, Image, Download } from "lucide-react";

const Chat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [contract, setContract] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Simulate contract data
    const mockContract = {
      id: "CTR-001",
      jobTitle: "Mobile App UI/UX Design",
      freelancer: {
        name: "Sarah Chen",
        avatar: "",
        online: true
      },
      client: {
        name: "Tech Innovations Inc.",
        avatar: "",
        online: false
      }
    };

    // Simulate message history
    const mockMessages = [
      {
        id: 1,
        sender: "client",
        text: "Hi Sarah! I wanted to discuss the color scheme for the mobile app.",
        timestamp: "2025-01-15T10:30:00",
        type: "text"
      },
      {
        id: 2,
        sender: "freelancer",
        text: "Hello! I've prepared some color palette options. Would you like me to share them?",
        timestamp: "2025-01-15T10:32:00",
        type: "text"
      },
      {
        id: 3,
        sender: "freelancer",
        text: "color-palette.pdf",
        timestamp: "2025-01-15T10:33:00",
        type: "file",
        fileType: "pdf",
        fileSize: "2.4 MB"
      },
      {
        id: 4,
        sender: "client",
        text: "Thanks! The palette looks great. Let's proceed with option B.",
        timestamp: "2025-01-15T10:35:00",
        type: "text"
      }
    ];

    setContract(mockContract);
    setMessages(mockMessages);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: "client", // Assuming current user is client
      text: newMessage,
      timestamp: new Date().toISOString(),
      type: "text"
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const message = {
      id: messages.length + 1,
      sender: "client",
      text: file.name,
      timestamp: new Date().toISOString(),
      type: "file",
      fileType: file.type.split('/')[1],
      fileSize: (file.size / 1024 / 1024).toFixed(1) + " MB"
    };

    setMessages(prev => [...prev, message]);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-4 h-screen">
        {/* Sidebar - Conversations List */}
        <div className="lg:col-span-1 border-r bg-card">
          <CardHeader className="border-b">
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <div className="p-4 space-y-2">
            {/* Current Contract */}
            <div className="p-3 border rounded-lg bg-primary/5 border-primary/20">
              <div className="font-semibold text-sm">{contract?.jobTitle}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Contract #{contract?.id}
              </div>
              <Badge variant="secondary" className="mt-2 text-xs">
                Active
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={contract?.freelancer.avatar} />
                <AvatarFallback>
                  {contract?.freelancer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{contract?.freelancer.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className={`w-2 h-2 rounded-full ${
                    contract?.freelancer.online ? 'bg-success' : 'bg-muted'
                  }`} />
                  {contract?.freelancer.online ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Contract Details
            </Button>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "client" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {message.sender === "client" 
                      ? contract?.client.name.split(' ').map(n => n[0]).join('')
                      : contract?.freelancer.name.split(' ').map(n => n[0]).join('')
                    }
                  </AvatarFallback>
                </Avatar>
                
                <div className={`max-w-[70%] ${
                  message.sender === "client" ? "text-right" : "text-left"
                }`}>
                  {message.type === "text" ? (
                    <div className={`inline-block p-3 rounded-lg ${
                      message.sender === "client"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}>
                      {message.text}
                    </div>
                  ) : (
                    <div className={`inline-flex items-center gap-2 p-3 border rounded-lg ${
                      message.sender === "client"
                        ? "bg-primary/10 border-primary/20"
                        : "bg-muted border-muted-foreground/20"
                    }`}>
                      <FileText className="w-4 h-4" />
                      <div className="text-sm">
                        <div className="font-medium">{message.text}</div>
                        <div className="text-xs text-muted-foreground">
                          {message.fileType?.toUpperCase()} • {message.fileSize}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-2">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Message Input */}
          <div className="border-t p-4">
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
              <Button type="submit" disabled={!newMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;