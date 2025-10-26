// pages/ContractPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import contractService from "@/services/contract.service";

const ContractPage = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContract();
  }, [id]);

  const fetchContract = async () => {
    try {
      setLoading(true);
      const response = await contractService.getContractById(id);
      const contractData = response.data || response;
      setContract(contractData);
    } catch (error) {
      toast.error("Failed to load contract");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!contract?.paymentRules || contract.paymentRules.length === 0) return 0;
    const completed = contract.paymentRules.filter(m => m.status === "released").length;
    return Math.round((completed / contract.paymentRules.length) * 100);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  if (!contract) return <div className="min-h-screen bg-background flex items-center justify-center">Contract not found</div>;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Contract #{contract._id?.substring(0, 8)}</h1>
            <p className="text-muted-foreground mt-2">{contract.job?.title}</p>
          </div>
          <Badge variant={
            contract.status === "completed" ? "success" :
            contract.status === "active" ? "info" : "secondary"
          }>
            {contract.status?.toUpperCase()}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Project Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{calculateProgress()}%</span>
                  </div>
                  <Progress value={calculateProgress()} />
                </div>
                
                <div className="space-y-3">
                  {contract.paymentRules?.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        milestone.status === "released" 
                          ? 'bg-success text-white' 
                          : 'bg-muted'
                      }`}>
                        {milestone.status === "released" && <CheckCircle className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{milestone.milestoneName}</div>
                        <div className="text-sm text-muted-foreground">
                          Amount: ${milestone.amount}
                        </div>
                      </div>
                      <Badge variant={milestone.status === "released" ? "success" : "secondary"}>
                        {milestone.status}
                      </Badge>
                    </div>
                  )) || <p className="text-muted-foreground">No milestones defined</p>}
                </div>
              </CardContent>
            </Card>

            {/* Contract Details */}
            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>Amount: ${contract.agreedRate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span>Type: {contract.paymentType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Start: {new Date(contract.startDate).toLocaleDateString()}</span>
                  </div>
                  {contract.endDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>End: {new Date(contract.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Parties */}
            <Card>
              <CardHeader>
                <CardTitle>Parties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Client</h4>
                  <p>{contract.client?.username}</p>
                  <p className="text-sm text-muted-foreground">{contract.client?.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Freelancer</h4>
                  <p>{contract.freelancer?.username}</p>
                  <p className="text-sm text-muted-foreground">{contract.freelancer?.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Escrow Status */}
            <Card>
              <CardHeader>
                <CardTitle>Escrow Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    contract.escrow.funded ? 'bg-success' : 'bg-warning'
                  }`} />
                  <span>
                    {contract.escrow.funded ? 'Funded' : 'Pending'} (${contract.escrow.amount})
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Funds are {contract.escrow.status} in escrow and will be released upon project completion.
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <a href="/chat">Message</a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/work-delivery">Submit Work</a>
                </Button>
                <Button variant="outline" className="w-full">
                  Download Contract
                </Button>
                {!contract.escrow.funded && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/escrow-funding">Fund Escrow</a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractPage;