
'use client';
import { useEffect, useState, useCallback } from 'react';
import { getSubmissions, Submission, SubmissionStatus } from '@/services/submissionService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import Image from 'next/image';
import { Button } from '../ui/button';
import { generateReportAction, updateSubmissionStatusAction } from '@/app/admin/actions';
import { toast } from 'sonner';
import { Loader2, CheckCircle, Mail, Eye } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { cn } from '@/lib/utils';


const statusConfig: { [key in Exclude<SubmissionStatus, 'draft' | 'pending_payment'>]: { title: string; color: string } } = {
    paid: { title: "Paid & Pending", color: "bg-yellow-500" },
    'in progress': { title: "In Progress", color: "bg-blue-500" },
    completed: { title: "Completed", color: "bg-green-500" },
};

// All statuses the Kanban board should display
const kanbanStatuses: SubmissionStatus[] = ['pending_payment', 'paid', 'in progress', 'completed'];

const kanbanStatusConfig: { [key in SubmissionStatus]?: { title: string; color: string } } = {
    pending_payment: { title: "Pending Payment", color: "bg-gray-400" },
    paid: { title: "Paid & Pending", color: "bg-yellow-500" },
    'in progress': { title: "In Progress", color: "bg-blue-500" },
    completed: { title: "Completed", color: "bg-green-500" },
};


export function KanbanBoard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all submissions relevant to the admin workflow
      const subs = await getSubmissions(kanbanStatuses);
      setSubmissions(subs);
    } catch (err) {
      setError('Failed to load submissions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleGenerateReport = async (sub: Submission) => {
    setGeneratingId(sub.id);
    const result = await generateReportAction(sub.id, sub.questionnaireResponses, sub.photoDataUri);
    if (result.success) {
      toast.success("Report Generated", {
        description: "The style report has been successfully created and saved.",
      });
      fetchSubmissions(); // Refresh the board
    } else {
      toast.error("Generation Failed", {
        description: result.error || "An unknown error occurred.",
      });
    }
    setGeneratingId(null);
  };
  
  const handleStatusChange = async (submissionId: string, status: SubmissionStatus) => {
    const result = await updateSubmissionStatusAction(submissionId, status);
     if (result.success) {
      toast.success("Status Updated", {
        description: `Submission moved to ${kanbanStatusConfig[status]?.title}.`,
      });
      fetchSubmissions(); // Refresh the board
    } else {
      toast.error("Update Failed", {
        description: result.error || "An unknown error occurred.",
      });
    }
  }

  const handleSendEmail = (submissionId: string) => {
    const origin = window.location.origin;
    const reportUrl = `${origin}/report/${submissionId}`;
    const subject = "Your Aura Colours Style Report is Ready!";
    const body = `Hello,\n\nThank you for choosing Aura Colours! Your personalized style report is now ready.\n\nYou can view your full analysis here:\n${reportUrl}\n\nWe hope you love your new colors!\n\nBest,\nThe Aura Colours Team`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };


  if (loading) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error) {
    return <div className="text-destructive p-8 text-center">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start flex-1 w-full">
        {(Object.keys(kanbanStatusConfig) as SubmissionStatus[]).map((status) => (
             kanbanStatusConfig[status] && 
            <div key={status} className={cn("bg-muted rounded-lg p-4 h-full", kanbanStatusConfig[status]?.color)}>
                <div className="flex items-center gap-2 mb-4 text-white">
                    <h2 className="font-bold text-lg">{kanbanStatusConfig[status]?.title}</h2>
                    <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                        {submissions.filter(s => s.status === status).length}
                    </Badge>
                </div>
                <div className="space-y-4">
                    {submissions.filter(s => s.status === status).map(sub => (
                        <Card key={sub.id} className="shadow-sm" data-testid={`submission-card-${sub.id}`}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-base">Submission #${sub.id.substring(0,6)}</CardTitle>
                                        <CardDescription>{sub.createdAt ? format(sub.createdAt, 'PP') : 'N/A'}</CardDescription>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="More options">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {(Object.keys(kanbanStatusConfig) as SubmissionStatus[]).map(s => (
                                                kanbanStatusConfig[s] && 
                                                <DropdownMenuItem key={s} onSelect={() => handleStatusChange(sub.id, s)} disabled={status === s}>
                                                    Move to {kanbanStatusConfig[s]?.title}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                             <CardContent className="space-y-4">
                                <Image
                                    src={sub.photoDataUri}
                                    alt="Client submission"
                                    width={200}
                                    height={200}
                                    className="rounded-md object-cover w-full aspect-square"
                                    data-ai-hint="portrait person"
                                />
                                <div className="max-h-24 overflow-y-auto text-sm bg-background p-2 rounded-md border">
                                    <p className="font-semibold text-xs mb-1 text-muted-foreground">Questionnaire</p>
                                    <p className="whitespace-pre-wrap break-words">{sub.questionnaireResponses}</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                {sub.status === 'completed' ? (
                                    <div className="flex gap-2 w-full">
                                        <Button asChild variant="outline" size="sm" className="flex-1">
                                            <Link href={`/report/${sub.id}`}><Eye className="mr-2 h-4 w-4" />View</Link>
                                        </Button>
                                        <Button onClick={() => handleSendEmail(sub.id)} size="sm" className="flex-1">
                                            <Mail className="mr-2 h-4 w-4" />Send
                                        </Button>
                                    </div>
                                ) : (
                                    <Button onClick={() => handleGenerateReport(sub)} disabled={generatingId === sub.id || sub.status !== 'paid'} size="sm" className="w-full">
                                        {generatingId === sub.id ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Generating...
                                            </>
                                        ) : 'Generate Report'}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        ))}
    </div>
  );
}
