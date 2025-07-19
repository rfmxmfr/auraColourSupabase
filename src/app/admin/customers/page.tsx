
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomersPage() {
  return (
    <div>
      <div className="flex items-center mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">Customers</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>
            This section is under construction. A searchable and filterable directory of all users will be available here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">Customer data table will be displayed here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
