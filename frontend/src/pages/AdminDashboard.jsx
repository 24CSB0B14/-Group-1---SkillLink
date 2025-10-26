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
      toast.error("Failed to load dashboard data");
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
      toast.error("Failed to resolve dispute");
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
        toast.error("Failed to release escrow");
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
        toast.error("Failed to refund client");
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

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
                          <Button size="sm" onClick={() => handleOpenResolution(dispute)}>
                            Review
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
                      <TableRow key={user._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>
                                {user.username?.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.username || user.email}</span>
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
                            {user.status || 'active'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell className="font-medium">{transaction._id?.slice(-8)}</TableCell>
                        <TableCell>{transaction.job?.title || 'N/A'}</TableCell>
                        <TableCell>${transaction.amount}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {transaction.paymentType || 'escrow'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {transaction.status === 'pending' && (
                              <>
                                <Button size="sm" onClick={() => handleReleaseEscrow(transaction._id)}>
                                  Release
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleRefundClient(transaction._id)}>
                                  Refund
                                </Button>
                              </>
                            )}
                          </div>
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

      {/* Dispute Resolution Modal */}
      <Dialog open={isResolutionModalOpen} onOpenChange={(open) => {
        setIsResolutionModalOpen(open);
        if (!open) {
          setResolutionNotes("");
          setResolutionDecision("");
          setSelectedDispute(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resolve Dispute #{selectedDispute?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {selectedDispute && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Contract</h4>
                    <p className="text-sm">{selectedDispute.contractId}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Amount</h4>
                    <p className="text-sm">${selectedDispute.amount}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Client</h4>
                    <p className="text-sm">{selectedDispute.client}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Freelancer</h4>
                    <p className="text-sm">{selectedDispute.freelancer}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Reason</h4>
                  <p className="text-sm text-muted-foreground">{selectedDispute.reason}</p>
                </div>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium mb-2 block">Decision</Label>
              <div className="space-y-2">
                {[
                  { value: "client", label: "Award to Client (Full Refund)" },
                  { value: "freelancer", label: "Award to Freelancer (Full Payment)" },
                  { value: "split", label: "Split Payment" },
                  { value: "continue", label: "Continue Work" }
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="decision"
                      value={option.value}
                      checked={resolutionDecision === option.value}
                      onChange={(e) => setResolutionDecision(e.target.value)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{option.label}</span>
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