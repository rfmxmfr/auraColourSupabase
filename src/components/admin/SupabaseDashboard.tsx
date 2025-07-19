'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

export function SupabaseDashboard() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch submissions from Supabase view
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('admin_dashboard_submissions')
          .select('*');
          
        if (submissionsError) throw submissionsError;
        
        // Fetch reports from Supabase view
        const { data: reportsData, error: reportsError } = await supabase
          .from('admin_dashboard_reports')
          .select('*');
          
        if (reportsError) throw reportsError;
        
        setSubmissions(submissionsData || []);
        setReports(reportsData || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-8">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="submissions">
          <TabsList className="mb-4">
            <TabsTrigger value="submissions">Submissions ({submissions.length})</TabsTrigger>
            <TabsTrigger value="reports">Reports ({reports.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submissions">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Photo</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{format(new Date(sub.created_at), 'PPP')}</TableCell>
                    <TableCell>{sub.user_email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        sub.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        sub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {sub.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {sub.photo_url && (
                        <Image
                          src={sub.photo_url}
                          alt="User submission"
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/submission/${sub.id}`}>View Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="reports">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Submission ID</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{format(new Date(report.created_at), 'PPP')}</TableCell>
                    <TableCell>{report.user_email}</TableCell>
                    <TableCell>{report.submission_id}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/report/${report.id}`}>View Report</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}