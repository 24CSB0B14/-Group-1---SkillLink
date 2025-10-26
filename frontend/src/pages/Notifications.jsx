// pages/Notifications.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCircle, AlertTriangle, Info, MessageCircle, DollarSign, FileText } from "lucide-react";
import { toast } from "sonner";
import notificationService from "@/services/notification.service";

const Notifications = () => {
  const [notifications, setNotifications] = useState({ unread: [], read: [] });
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications();
      const data = response.data || response;
      
      const unreadNotifs = data.notifications.filter(n => !n.isRead);
      const readNotifs = data.notifications.filter(n => n.isRead);
      
      setNotifications({
        unread: unreadNotifs,
        read: readNotifs
      });
      setUnreadCount(data.unreadCount || unreadNotifs.length);
    } catch (error) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => {
        const notification = prev.unread.find(n => n._id === id);
        if (notification) {
          return {
            unread: prev.unread.filter(n => n._id !== id),
            read: [{ ...notification, isRead: true }, ...prev.read]
          };
        }
        return prev;
      });
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => ({
        unread: [],
        read: [...prev.unread.map(n => ({ ...n, isRead: true })), ...prev.read]
      }));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
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
                  getRelativeTime={getRelativeTime}
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
                key={notification._id}
                notification={notification}
                getIcon={getIcon}
                getRelativeTime={getRelativeTime}
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
const NotificationCard = ({ notification, onMarkAsRead, getIcon, getRelativeTime }) => (
  <Card className={`transition hover:shadow-md ${!notification.isRead ? 'border-primary/20 bg-primary/5' : ''}`}>
    <CardContent className="p-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {getIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-semibold text-sm">{notification.title}</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{getRelativeTime(notification.createdAt)}</span>
              {!notification.isRead && onMarkAsRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsRead(notification._id)}
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
          
          {notification.actionUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={notification.actionUrl}>View Details</a>
            </Button>
          )}
        </div>

        {!notification.isRead && (
          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
        )}
      </div>
    </CardContent>
  </Card>
);

export default Notifications;