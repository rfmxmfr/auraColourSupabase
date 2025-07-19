
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div>
        <div className="flex items-center mb-6">
            <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
        </div>
        <Card>
            <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>
                This section is under construction. Manage services, pricing, and notification rules here.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="flex items-center justify-center h-48 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Configuration options will be displayed here.</p>
            </div>
            </CardContent>
        </Card>
    </div>
  );
}
