
'use client';
import { useEffect, useState } from 'react';
import { getSubmissions, Submission } from '@/services/submissionService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import Image from 'next/image';
import { Button } from '../ui/button';
import { generateReportAction } from '@/app/admin/actions';
import { toast } from 'sonner';
import { Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export function SubmissionList() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const subs = await getSubmissions();
        setSubmissions(subs);
      } catch (err) {
        setError('Failed to load submissions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, []);

  const handleGenerateReport = async (sub: Submission) => {
    setGeneratingId(sub.id);
    const result = await generateReportAction(sub.id, sub.questionnaireResponses, sub.photoDataUri);
    if (result.success) {
      toast.success("Report Generated", {
        description: "The style report has been successfully created and saved.",
      });
      // Refresh the list to show the updated status
      const updatedSubmissions = submissions.map(s => 
        s.id === sub.id ? { ...s, status: 'completed' } : s
      );
      setSubmissions(updatedSubmissions);
    } else {
      toast.error("Generation Failed", {
        description: result.error || "An unknown error occurred.",
      });
    }
    setGeneratingId(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error) {
    return <div className="text-destructive p-8 text-center">{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Questionnaire</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>
                  <Image
                    src={sub.photoDataUri}
                    alt="Client submission"
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                    data-ai-hint="portrait person"
                  />
                </TableCell>
                <TableCell>{sub.createdAt ? format(sub.createdAt, 'PPP') : 'N/A'}</TableCell>
                <TableCell className="max-w-xs whitespace-pre-wrap break-words">{sub.questionnaireResponses}</TableCell>
                <TableCell>
                   <Badge variant={sub.status === 'completed' ? 'default' : 'secondary'} className={sub.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {sub.status || 'pending'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {sub.status === 'completed' ? (
                     <Button asChild variant="outline" size="sm">
                      <Link href={`/report/${sub.id}`}>View Report</Link>
                    </Button>
                  ) : (
                    <Button onClick={() => handleGenerateReport(sub)} disabled={generatingId === sub.id} size="sm">
                      {generatingId === sub.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : 'Generate Report'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
