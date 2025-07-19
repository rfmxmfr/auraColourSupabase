
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div>
      <div className="flex items-center mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">Analytics</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>
            This section is under construction. Key metrics and performance reports will be available here soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">Analytics charts and data will be displayed here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
