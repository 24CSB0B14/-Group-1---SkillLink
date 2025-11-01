// pages/EscrowFunding.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, DollarSign, CheckCircle, Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";

const EscrowFunding = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would fetch the actual contract data
        // For now, we'll use placeholder data
        const contractData = {
          id: id || "CTR-001",
          jobTitle: "Project Title",
          amount: 1000,
          freelancer: "Freelancer Name",
          status: "pending-funding"
        };
        setContract(contractData);
      } catch (error) {
        console.error('Error fetching contract:', error);
        if (error.response?.data?.message) {
          toast.error(`Failed to load contract details: ${error.response.data.message}`);
        } else if (error.message) {
          toast.error(`Failed to load contract details: ${error.message}`);
        } else {
          toast.error("Failed to load contract details. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id]);

  const handleFundEscrow = async () => {
    if (walletBalance < contract.amount) {
      toast.error("Insufficient balance");
      return;
    }
    
    try {
      // In a real implementation, you would call the escrow funding API
      // For now, we'll just show a success message
      toast.success("Escrow funded successfully!");
      navigate("/contract/" + contract.id);
    } catch (error) {
      console.error('Error funding escrow:', error);
      if (error.response?.data?.message) {
        toast.error(`Failed to fund escrow: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Failed to fund escrow: ${error.message}`);
      } else {
        toast.error("Failed to fund escrow. Please try again later.");
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Fund Escrow</CardTitle>
                <p className="text-muted-foreground">
                  Secure payment for: {contract.jobTitle}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Contract Summary */}
            <div className="grid md:grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/30">
              <div>
                <h4 className="font-semibold mb-2">Contract Details</h4>
                <div className="space-y-1 text-sm">
                  <p>Contract: #{contract.id}</p>
                  <p>Freelancer: {contract.freelancer}</p>
                  <p>Amount: <span className="font-semibold">${contract.amount}</span></p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Your Wallet</h4>
                <div className="space-y-1 text-sm">
                  <p>Available Balance: <span className="font-semibold">${walletBalance.toFixed(2)}</span></p>
                  <p>After Funding: <span className="font-semibold">${(walletBalance - contract.amount).toFixed(2)}</span></p>
                </div>
              </div>
            </div>

            {/* Escrow Benefits */}
            <div className="space-y-4">
              <h4 className="font-semibold">How Escrow Protects You</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Lock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h5 className="font-medium">Secure Holding</h5>
                    <p className="text-sm text-muted-foreground">
                      Funds are held securely until work is completed and approved
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h5 className="font-medium">Quality Assurance</h5>
                    <p className="text-sm text-muted-foreground">
                      Review work before releasing payment to freelancer
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Funding Steps */}
            <div className="space-y-4">
              <h4 className="font-semibold">Funding Process</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                    1
                  </div>
                  <span>Transfer ${contract.amount} to escrow</span>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-sm flex items-center justify-center">
                    2
                  </div>
                  <span>Freelancer completes the work</span>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-sm flex items-center justify-center">
                    3
                  </div>
                  <span>You review and approve the work</span>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-sm flex items-center justify-center">
                    4
                  </div>
                  <span>Payment released to freelancer</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={handleFundEscrow}
                disabled={walletBalance < contract.amount}
                className="flex-1"
                size="lg"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Fund Escrow (${contract.amount})
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/contract/" + contract.id)}
                size="lg"
              >
                Cancel
              </Button>
            </div>

            {walletBalance < contract.amount && (
              <div className="flex items-center gap-2 p-3 border border-warning/20 bg-warning/10 rounded-lg">
                <AlertCircle className="w-4 h-4 text-warning" />
                <span className="text-sm text-warning">
                  Insufficient balance. You need ${(contract.amount - walletBalance).toFixed(2)} more.
                </span>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EscrowFunding;