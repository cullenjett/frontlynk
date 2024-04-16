import { GeneralErrorBoundary } from '~/components/error-boundary';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card';

export default function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <div className="border p-4 rounded-lg shadow-sm min-h-24 bg-card border-t-4 border-t-jordy-blue"></div>
        <div className="border p-4 rounded-lg shadow-sm min-h-24 bg-card border-t-4 border-t-burnt-sienna"></div>
        <div className="border p-4 rounded-lg shadow-sm min-h-24 bg-card border-t-4 border-t-mirage"></div>
        <div className="border p-4 rounded-lg shadow-sm min-h-24 bg-card border-t-4 border-t-blue-chill"></div>
      </div>

      <div className="grid gap-4 grid-cols-[2fr_1fr] h-full">
        <Card>
          <CardHeader>
            <CardTitle>Onboarding</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter></CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </>
  );
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
