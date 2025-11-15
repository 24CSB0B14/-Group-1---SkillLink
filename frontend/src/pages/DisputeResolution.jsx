// pages/DisputeResolution.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, MessageCircle, FileText, DollarSign, Calendar } from "lucide-react";

const DisputeResolution = () => {
  const { id } = useParams();
  const [dispute, setDispute] = useState(null);
  const [resolution, setResolution] = useState("");
  const [decision, setDecision] = useState("");

  useEffect(() => {
    const fetchDispute = async () => {
      try {
        // In a real implementation, you would fetch the actual dispute data from an API
        // For now, we'll use placeholder data
        const disputeData = {
          id: id || "DSP-001",
          contractId: "CTR-045",
          client: {
            name: "Client Name",
            email: "client@example.com"
          },
          freelancer: {
            name: "Freelancer Name",
            email: "freelancer@example.com"
          },
          jobTitle: "Project Title",
          amount: 1000,
          reason: "Dispute reason would be loaded here",
          clientStatement: "Client statement would be loaded here",
          freelancerStatement: "Freelancer statement would be loaded here",
          evidence: [],
          status: "in-review",
          createdAt: new Date().toISOString()
        };

        setDispute(disputeData);
      } catch (error) {
        console.error("Failed to load dispute:", error);
        if (error.response?.data?.message) {
          toast.error(`Failed to load dispute: ${error.response.data.message}`);
        } else if (error.message) {
          toast.error(`Failed to load dispute: ${error.message}`);
        } else {
          toast.error("Failed to load dispute. Please try again later.");
        }
      }
    };

    fetchDispute();
  }, [id]);

  const handleSubmitResolution = async (e) => {
    e.preventDefault();
    
    try {
      // In a real implementation, you would submit the resolution to an API
      // For now, we'll just show a success message
      toast.success("Dispute resolution submitted successfully!");
    } catch (error) {
      console.error('Error submitting dispute resolution:', error);
      if (error.response?.data?.message) {
        toast.error(`Failed to submit dispute resolution: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Failed to submit dispute resolution: ${error.message}`);
      } else {
        toast.error("Failed to submit dispute resolution. Please try again later.");
      }
    }
  };

  if (!dispute) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Dispute Resolution</h1>
            <p className="text-muted-foreground">Case #{dispute.id}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dispute Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Dispute Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Contract Details</h4>
                    <div className="space-y-1 text-sm">
                      <p>Contract: #{dispute.contractId}</p>
                      <p>Project: {dispute.jobTitle}</p>
                      <p>Amount: <span className="font-semibold">${dispute.amount}</span></p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Parties Involved</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {dispute.client.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">Client: {dispute.client.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {dispute.freelancer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">Freelancer: {dispute.freelancer.name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Reason for Dispute</h4>
                  <p className="text-sm text-muted-foreground">{dispute.reason}</p>
                </div>
              </CardContent>
            </Card>

            {/* Statements */}
            <Card>
              <CardHeader>
                <CardTitle>Statements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">{dispute.client.name.split(' ').map(n => n[0]).join('') || 'C'}</AvatarFallback>
                    </Avatar>
                    Client Statement
                  </h4>
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <p className="text-sm">{dispute.clientStatement}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">{dispute.freelancer.name.split(' ').map(n => n[0]).join('') || 'F'}</AvatarFallback>
                    </Avatar>
                    Freelancer Statement
                  </h4>
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <p className="text-sm">{dispute.freelancerStatement}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Evidence */}
            <Card>
              <CardHeader>
                <CardTitle>Evidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dispute.evidence.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {item.type === "file" ? (
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <MessageCircle className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{item.name || item.content}</p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded by: {item.uploadedBy || item.from}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toast.info("File viewing feature coming soon")}>
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Resolution */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resolution</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitResolution} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Decision</label>
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
                            checked={decision === option.value}
                            onChange={(e) => setDecision(e.target.value)}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Resolution Notes</label>
                    <Textarea
                      placeholder="Explain your decision and any additional notes..."
                      rows={6}
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      required
                    />
                  </div>

                  {decision === "split" && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Split Amount</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">Client</label>
                          <input
                            type="number"
                            placeholder="Amount"
                            className="w-full p-2 border rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Freelancer</label>
                          <input
                            type="number"
                            placeholder="Amount"
                            className="w-full p-2 border rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={!decision || !resolution}>
                    Submit Resolution
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Both Parties
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  View Contract
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Mediation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeResolution;