import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Search, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import messageService from "@/services/message.service";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [newChatReceiverIdentifier, setNewChatReceiverIdentifier] = useState("");

  useEffect(() => {
    try {
      fetchConversations();
    } catch (error) {
      console.error('Error initializing messages:', error);
      toast({
        title: "Error",
        description: "Failed to initialize messages",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = conversations.filter((conv) => {
        const otherUser = conv.participants?.find((p) => p._id !== user?._id);
        return otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
               otherUser?.username?.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations, user]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await messageService.getUserConversations();
      const data = response.data || response || [];
      setConversations(Array.isArray(data) ? data : []);
      setFilteredConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
      setFilteredConversations([]);
      if (error.response?.data?.message) {
        toast({
          title: "Error",
          description: `Failed to load conversations: ${error.response.data.message}`,
          variant: "destructive",
        });
      } else if (error.message) {
        toast({
          title: "Error",
          description: `Failed to load conversations: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load conversations. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewChat = async () => {
    if (!newChatReceiverIdentifier.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username, email, or user ID",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await messageService.startConversation(newChatReceiverIdentifier);
      // Handle different response formats
      let conversationData = null;
      if (response && response.data) {
        conversationData = response.data;
      } else if (response) {
        conversationData = response;
      }
      
      if (conversationData && (conversationData._id || conversationData.id)) {
        navigate(`/chat/${conversationData._id || conversationData.id}`);
        setIsNewChatOpen(false);
        setNewChatReceiverIdentifier("");
      } else {
        throw new Error("Invalid conversation data received");
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      if (error.response?.data?.message) {
        toast({
          title: "Error",
          description: `Failed to start conversation: ${error.response.data.message}`,
          variant: "destructive",
        });
      } else if (error.message) {
        toast({
          title: "Error",
          description: `Failed to start conversation: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to start conversation. Please check the username/email.",
          variant: "destructive",
        });
      }
    }
  };

  const getOtherParticipant = (conv) => {
    return conv.participants?.find((p) => p._id !== user?._id) || 
           conv.participants?.find((p) => p.id !== user?._id) ||
           conv.participants?.[0];
  };

  const formatDate = (date) => {
    if (!date) return "Unknown";
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8" />
                <CardTitle className="text-2xl">Messages</CardTitle>
              </div>
              <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Chat
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Start New Conversation</DialogTitle>
                    <DialogDescription>
                      Enter the username, email, or user ID of the person you want to message.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="userIdentifier">Username / Email / User ID</Label>
                      <Input
                        id="userIdentifier"
                        placeholder="e.g., john_doe or john@example.com"
                        value={newChatReceiverIdentifier}
                        onChange={(e) => setNewChatReceiverIdentifier(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleStartNewChat}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      Start Chat
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Search Bar */}
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Conversations List */}
            {filteredConversations.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start a new conversation to begin messaging
                </p>
                <Button
                  onClick={() => setIsNewChatOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredConversations.map((conv) => {
                  const otherUser = getOtherParticipant(conv);
                  
                  return (
                    <Card
                      key={conv._id || conv.id}
                      className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-purple-500"
                      onClick={() => navigate(`/chat/${conv._id || conv.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={otherUser?.profilePicture || otherUser?.avatar} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                              {otherUser?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || 
                               otherUser?.username?.substring(0, 2).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-lg truncate">
                                {otherUser?.name || otherUser?.username || "Unknown User"}
                              </h3>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(conv.updatedAt || conv.updated)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {otherUser?.role || "User"}
                              </Badge>
                              {conv.job && (
                                <Badge variant="secondary" className="text-xs">
                                  {conv.job.title || "Job"}
                                </Badge>
                              )}
                              {conv.contract && (
                                <Badge variant="secondary" className="text-xs">
                                  Contract
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-5 h-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Messages;