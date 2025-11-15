// pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, AlertTriangle, TrendingUp, DollarSign, FileText, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import adminService from "@/services/admin.service";
import disputeService from "@/services/dispute.service";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [disputes, setDisputes] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolutionDecision, setResolutionDecision] = useState("");
  const [resolutionLoading, setResolutionLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, disputesRes, usersRes, transactionsRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllDisputes(),
        adminService.getAllUsers({ limit: 10 }),
        adminService.getAllTransactions()
      ]);

      setStats(statsRes.data || {});
      setDisputes(disputesRes.data || []);
      setUsers(usersRes.data?.users || []);
      setTransactions(transactionsRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.data?.message) {
        toast.error(`Failed to load dashboard data: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Failed to load dashboard data: ${error.message}`);
      } else {
        toast.error("Failed to load dashboard data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning text-white';
      case 'in-review': return 'bg-info text-white';
      case 'resolved': return 'bg-success text-white';
      case 'verified': return 'bg-success text-white';
      default: return 'bg-secondary';
    }
  };

  const handleOpenResolution = (dispute) => {
    setSelectedDispute(dispute);
    setIsResolutionModalOpen(true);
  };

  const handleResolveDispute = async () => {
    if (!resolutionDecision || !resolutionNotes.trim()) {
      toast.error("Please select a decision and add resolution notes");
      return;
    }

    setResolutionLoading(true);
    try {
      await disputeService.resolveDispute(selectedDispute._id, {
        decision: resolutionDecision,
        resolution: resolutionNotes
      });
      toast.success(`Dispute resolved: ${resolutionDecision}`);
      setIsResolutionModalOpen(false);
      setResolutionNotes("");
      setResolutionDecision("");
      setSelectedDispute(null);
      fetchAllData(); // Refresh data
    } catch (error) {
      console.error('Error resolving dispute:', error);
      if (error.response?.data?.message) {
        toast.error(`Failed to resolve dispute: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Failed to resolve dispute: ${error.message}`);
      } else {
        toast.error("Failed to resolve dispute. Please try again later.");
      }
    } finally {
      setResolutionLoading(false);
    }
  };

  const handleReleaseEscrow = async (escrowId) => {
    if (window.confirm("Are you sure you want to release this escrow?")) {
      try {
        await escrowService.releaseEscrow(escrowId);
        toast.success("Escrow released successfully");
        fetchAllData();
      } catch (error) {
        console.error('Error releasing escrow:', error);
        if (error.response?.data?.message) {
          toast.error(`Failed to release escrow: ${error.response.data.message}`);
        } else if (error.message) {
          toast.error(`Failed to release escrow: ${error.message}`);
        } else {
          toast.error("Failed to release escrow. Please try again later.");
        }
      }
    }
  };

  const handleRefundClient = async (escrowId) => {
    if (window.confirm("Are you sure you want to refund the client?")) {
      try {
        await escrowService.refundClient(escrowId);
        toast.success("Client refunded successfully");
        fetchAllData();
      } catch (error) {
        console.error('Error refunding client:', error);
        if (error.response?.data?.message) {
          toast.error(`Failed to refund client: ${error.response.data.message}`);
        } else if (error.message) {
          toast.error(`Failed to refund client: ${error.message}`);
        } else {
          toast.error("Failed to refund client. Please try again later.");
        }
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">Loading...</div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 p-6">
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
                        <TableRow key={dispute._id}>
                          <TableCell className="font-medium">{dispute._id?.substring(0, 8)}</TableCell>
                          <TableCell>{dispute.contractId?.substring(0, 8)}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={dispute.client?.avatar} />
                                  <AvatarFallback>{dispute.client?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Client</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={dispute.freelancer?.avatar} />
                                  <AvatarFallback>{dispute.freelancer?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Freelancer</span>
                              </div>
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
                            <Button size="sm" onClick={() => handleOpenResolution(dispute)}>
                              Resolve
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">@{user.username}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.isVerified ? "default" : "secondary"}>
                              {user.isVerified ? "Verified" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              Manage
                            </Button>
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
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Transaction History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction._id}>
                          <TableCell className="font-medium">{transaction._id?.substring(0, 8)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{transaction.type}</Badge>
                          </TableCell>
                          <TableCell>${transaction.amount}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{transaction.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Platform Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">New Users</p>
                            <p className="text-2xl font-bold">+{stats.newUsers || 0}</p>
                          </div>
                          <Users className="w-8 h-8 text-primary/60" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                            <p className="text-2xl font-bold">${stats.revenue || 0}</p>
                          </div>
                          <DollarSign className="w-8 h-8 text-success/60" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                            <p className="text-2xl font-bold">{stats.activeProjects || 0}</p>
                          </div>
                          <FileText className="w-8 h-8 text-primary/60" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />

      {/* Dispute Resolution Modal */}
      <Dialog open={isResolutionModalOpen} onOpenChange={setIsResolutionModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {selectedDispute && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Dispute Details</Label>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <p><strong>ID:</strong> {selectedDispute._id}</p>
                    <p><strong>Reason:</strong> {selectedDispute.reason}</p>
                    <p><strong>Amount:</strong> ${selectedDispute.amount}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Parties Involved</Label>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={selectedDispute.client?.avatar} />
                          <AvatarFallback>{selectedDispute.client?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">Client</span>
                      </div>
                      <p className="text-sm">{selectedDispute.client?.name}</p>
                    </div>
                    <div className="flex-1 bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={selectedDispute.freelancer?.avatar} />
                          <AvatarFallback>{selectedDispute.freelancer?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">Freelancer</span>
                      </div>
                      <p className="text-sm">{selectedDispute.freelancer?.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium mb-2 block">Resolution Decision</Label>
              <div className="grid grid-cols-3 gap-2">
                {['client', 'freelancer', 'split'].map((decision) => (
                  <label
                    key={decision}
                    className={`p-3 border rounded-lg cursor-pointer text-center capitalize ${
                      resolutionDecision === decision
                        ? 'border-primary bg-primary/10'
                        : 'border-input hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="decision"
                      value={decision}
                      checked={resolutionDecision === decision}
                      onChange={(e) => setResolutionDecision(e.target.value)}
                      className="sr-only"
                    />
                    {decision}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Resolution Notes</Label>
              <Textarea
                placeholder="Explain your decision and any additional notes..."
                rows={6}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                required
              />
            </div>

            {resolutionDecision === "split" && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Split Amount</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Client</Label>
                    <input
                      type="number"
                      placeholder="Amount"
                      className="w-full p-2 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Freelancer</Label>
                    <input
                      type="number"
                      placeholder="Amount"
                      className="w-full p-2 border rounded text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsResolutionModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleResolveDispute} disabled={resolutionLoading || !resolutionDecision || !resolutionNotes.trim()}>
                {resolutionLoading ? "Submitting..." : "Submit Resolution"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;