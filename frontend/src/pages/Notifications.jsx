// pages/Notifications.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCircle, AlertTriangle, Info, MessageCircle, DollarSign, FileText } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState({
    unread: [
      {
        id: 1,
        type: "bid",
        title: "New Bid Received",
        message: "Sarah Chen submitted a bid for your Mobile App UI/UX Design project",
        time: "5 minutes ago",
        read: false,
        action: "/job-details/SKL-001"
      },
      {
        id: 2,
        type: "message",
        title: "New Message",
        message: "Mike Rodriguez sent you a message regarding the Website Development project",
        time: "1 hour ago",
        read: false,
        action: "/chat/CTR-002"
      },
      {
        id: 3,
        type: "payment",
        title: "Payment Received",
        message: "Payment of $1,200 has been released to your wallet",
        time: "2 hours ago",
        read: false,
        action: "/wallet"
      }
    ],
    read: [
      {
        id: 4,
        type: "contract",
        title: "Contract Started",
        message: "Your contract with Tech Innovations Inc. has begun",
        time: "1 day ago",
        read: true,
        action: "/contract/CTR-001"
      },
      {
        id: 5,
        type: "review",
        title: "New Review",
        message: "John Smith left you a 5-star review",
        time: "2 days ago",
        read: true,
        action: "/reviews"
      }
    ]
  });

  const markAsRead = (id) => {
    setNotifications(prev => {
      const notification = prev.unread.find(n => n.id === id);
      if (notification) {
        return {
          unread: prev.unread.filter(n => n.id !== id),
          read: [...prev.read, { ...notification, read: true }]
        };
      }
      return prev;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => ({
      unread: [],
      read: [...prev.read, ...prev.unread.map(n => ({ ...n, read: true }))]
    }));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'bid': return <DollarSign className="w-5 h-5 text-info" />;
      case 'message': return <MessageCircle className="w-5 h-5 text-primary" />;
      case 'payment': return <DollarSign className="w-5 h-5 text-success" />;
      case 'contract': return <FileText className="w-5 h-5 text-warning" />;
      case 'review': return <CheckCircle className="w-5 h-5 text-success" />;
      default: return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">Stay updated with your activity</p>
            </div>
          </div>
          {notifications.unread.length > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              Mark All as Read
            </Button>
          )}
        </div>

        <Tabs defaultValue="unread" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="unread">
              Unread
              {notifications.unread.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {notifications.unread.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
            <TabsTrigger value="all">All Notifications</TabsTrigger>
          </TabsList>

          {/* Unread Notifications */}
          <TabsContent value="unread" className="space-y-4">
            {notifications.unread.length > 0 ? (
              notifications.unread.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  getIcon={getIcon}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">You have no unread notifications.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Read Notifications */}
          <TabsContent value="read" className="space-y-4">
            {notifications.read.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                getIcon={getIcon}
              />
            ))}
          </TabsContent>

          {/* All Notifications */}
          <TabsContent value="all" className="space-y-4">
            {[...notifications.unread, ...notifications.read].map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                getIcon={getIcon}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Notification Card Component
const NotificationCard = ({ notification, onMarkAsRead, getIcon }) => (
  <Card className={`transition hover:shadow-md ${!notification.read ? 'border-primary/20 bg-primary/5' : ''}`}>
    <CardContent className="p-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {getIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-semibold text-sm">{notification.title}</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{notification.time}</span>
              {!notification.read && onMarkAsRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="h-6 px-2 text-xs"
                >
                  Mark read
                </Button>
              )}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">
            {notification.message}
          </p>
          
          <Button asChild variant="outline" size="sm">
            <a href={notification.action}>View Details</a>
          </Button>
        </div>

        {!notification.read && (
          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
        )}
      </div>
    </CardContent>
  </Card>
);

export default Notifications;