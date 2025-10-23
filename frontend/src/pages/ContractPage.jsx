// pages/ContractPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";

const ContractPage = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    // Simulate API call
    const mockContract = {
      id: "CTR-001",
      jobTitle: "Senior UI/UX Designer for Mobile App",
      freelancer: {
        name: "Sarah Chen",
        email: "sarah@example.com"
      },
      client: {
        name: "Tech Innovations Inc.",
        email: "contact@techinnovations.com"
      },
      terms: {
        amount: 5000,
        timeline: "4 weeks",
        startDate: "2025-01-15",
        endDate: "2025-02-15",
        milestones: [
          { name: "Research & Discovery", completed: true, dueDate: "2025-01-22" },
          { name: "Wireframes & Prototypes", completed: true, dueDate: "2025-01-29" },
          { name: "UI Design & Assets", completed: false, dueDate: "2025-02-05" },
          { name: "Final Delivery & Review", completed: false, dueDate: "2025-02-15" }
        ]
      },
      escrow: {
        funded: true,
        amount: 5000,
        status: "locked"
      },
      status: "in-progress",
      progress: 50
    };

    setContract(mockContract);
  }, [id]);

  if (!contract) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Contract #{contract.id}</h1>
            <p className="text-muted-foreground mt-2">{contract.jobTitle}</p>
          </div>
          <Badge variant={
            contract.status === "completed" ? "success" :
            contract.status === "in-progress" ? "info" : "secondary"
          }>
            {contract.status.toUpperCase()}
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
                    <span>{contract.progress}%</span>
                  </div>
                  <Progress value={contract.progress} />
                </div>
                
                <div className="space-y-3">
                  {contract.terms.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        milestone.completed 
                          ? 'bg-success text-white' 
                          : 'bg-muted'
                      }`}>
                        {milestone.completed && <CheckCircle className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{milestone.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Due: {milestone.dueDate}
                        </div>
                      </div>
                      <Badge variant={milestone.completed ? "success" : "secondary"}>
                        {milestone.completed ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                  ))}
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
                    <span>Amount: ${contract.terms.amount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Timeline: {contract.terms.timeline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Start: {contract.terms.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>End: {contract.terms.endDate}</span>
                  </div>
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
                  <p>{contract.client.name}</p>
                  <p className="text-sm text-muted-foreground">{contract.client.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Freelancer</h4>
                  <p>{contract.freelancer.name}</p>
                  <p className="text-sm text-muted-foreground">{contract.freelancer.email}</p>
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