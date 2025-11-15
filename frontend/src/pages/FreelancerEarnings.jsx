// pages/FreelancerEarnings.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, Wallet, Shield } from "lucide-react";
import { toast } from "sonner";
import contractService from "@/services/contract.service";
import escrowService from "@/services/escrow.service";

const FreelancerEarnings = () => {
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    pendingBalance: 0,
    availableBalance: 0
  });
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const response = await contractService.getUserContracts();
      const data = response.data || [];
      setContracts(data);
      
      // Calculate earnings
      const completed = data.filter(c => c.status === 'completed');
      const active = data.filter(c => c.status === 'active');
      
      const total = completed.reduce((sum, c) => sum + (c.agreedRate || 0), 0);
      const pending = active.reduce((sum, c) => sum + (c.agreedRate || 0), 0);
      
      setEarnings({
        totalEarnings: total,
        pendingBalance: pending,
        availableBalance: total - pending
      });
    } catch (error) {
      console.error('Error fetching earnings:', error);
      if (error.response?.data?.message) {
        toast.error(`Failed to load earnings: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Failed to load earnings: ${error.message}`);
      } else {
        toast.error("Failed to load earnings. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'released': case 'completed': return 'bg-success text-white';
      case 'pending': case 'active': return 'bg-warning text-white';
      case 'disputed': return 'bg-destructive text-white';
      default: return 'bg-secondary';
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Earnings</h1>
            <p className="text-muted-foreground mt-2">
              Track your payments and escrow status
            </p>
          </div>
          <Button asChild>
            <Link to="/freelancer-dashboard">My Dashboard</Link>
          </Button>
        </div>

        {/* Earnings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">${earnings.totalEarnings.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-success/60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available Balance</p>
                  <p className="text-2xl font-bold">${earnings.availableBalance.toLocaleString()}</p>
                </div>
                <Wallet className="w-8 h-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending in Escrow</p>
                  <p className="text-2xl font-bold">${earnings.pendingBalance.toLocaleString()}</p>
                </div>
                <Shield className="w-8 h-8 text-warning/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Escrow Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              My Contracts & Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract ID</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract._id}>
                    <TableCell className="font-medium">{contract._id.slice(-8)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{contract.job?.title || 'N/A'}</div>
                    </TableCell>
                    <TableCell>{contract.client?.username || 'N/A'}</TableCell>
                    <TableCell>${contract.agreedRate}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(contract.status)}>
                        {contract.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(contract.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/contract/${contract._id}`}>View Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreelancerEarnings;