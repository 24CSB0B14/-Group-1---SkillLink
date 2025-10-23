// pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, AlertTriangle, TrendingUp, DollarSign, FileText, MessageCircle } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [disputes, setDisputes] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Simulate API calls
    const mockStats = {
      totalUsers: 1247,
      activeContracts: 89,
      pendingDisputes: 12,
      totalRevenue: 28450,
      platformFee: 2845
    };

    const mockDisputes = [
      {
        id: "DSP-001",
        contractId: "CTR-045",
        client: "John Smith",
        freelancer: "Sarah Chen",
        amount: 2500,
        reason: "Quality of work not meeting expectations",
        status: "pending",
        createdAt: "2025-01-20"
      },
      {
        id: "DSP-002",
        contractId: "CTR-067",
        client: "Tech Corp",
        freelancer: "Mike Rodriguez",
        amount: 1800,
        reason: "Missed deadline without communication",
        status: "in-review",
        createdAt: "2025-01-19"
      }
    ];

    const mockUsers = [
      {
        id: 1,
        name: "Sarah Chen",
        email: "sarah@example.com",
        role: "freelancer",
        status: "verified",
        joinDate: "2024-06-15"
      },
      {
        id: 2,
        name: "John Smith",
        email: "john@techcorp.com",
        role: "client",
        status: "pending",
        joinDate: "2025-01-10"
      }
    ];

    const mockTransactions = [
      {
        id: "TXN-001",
        contractId: "CTR-045",
        amount: 2500,
        type: "escrow_deposit",
        status: "completed",
        date: "2025-01-15"
      },
      {
        id: "TXN-002",
        contractId: "CTR-067",
        amount: 1800,
        type: "payout",
        status: "completed",
        date: "2025-01-18"
      }
    ];

    setStats(mockStats);
    setDisputes(mockDisputes);
    setUsers(mockUsers);
    setTransactions(mockTransactions);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning text-white';
      case 'in-review': return 'bg-info text-white';
      case 'resolved': return 'bg-success text-white';
      case 'verified': return 'bg-success text-white';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform management and oversight</p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-semibold">Administrator</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Contracts</p>
                  <p className="text-2xl font-bold">{stats.activeContracts}</p>
                </div>
                <FileText className="w-8 h-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Disputes</p>
                  <p className="text-2xl font-bold">{stats.pendingDisputes}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-warning/60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Platform Revenue</p>
                  <p className="text-2xl font-bold">${stats.platformFee}</p>
                </div>
                <DollarSign className="w-8 h-8 text-success/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="disputes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Disputes Tab */}
          <TabsContent value="disputes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Active Disputes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dispute ID</TableHead>
                      <TableHead>Contract</TableHead>
                      <TableHead>Parties</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disputes.map((dispute) => (
                      <TableRow key={dispute.id}>
                        <TableCell className="font-medium">{dispute.id}</TableCell>
                        <TableCell>{dispute.contractId}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Client: {dispute.client}</div>
                            <div>Freelancer: {dispute.freelancer}</div>
                          </div>
                        </TableCell>
                        <TableCell>${dispute.amount}</TableCell>
                        <TableCell className="max-w-xs truncate">{dispute.reason}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(dispute.status)}>
                            {dispute.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" asChild>
                            <a href={`/dispute-resolution/${dispute.id}`}>
                              Review
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Verify
                            </Button>
                            <Button size="sm" variant="outline">
                              Message
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Contract</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.contractId}</TableCell>
                        <TableCell>${transaction.amount}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-success text-white">
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary/60" />
                    <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">5 new users registered</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">3 new contracts created</p>
                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;