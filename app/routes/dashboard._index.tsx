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
        <div className="min-h-24 rounded-lg border border-t-4 border-t-jordy-blue bg-card p-4 shadow-sm"></div>
        <div className="min-h-24 rounded-lg border border-t-4 border-t-burnt-sienna bg-card p-4 shadow-sm"></div>
        <div className="min-h-24 rounded-lg border border-t-4 border-t-mirage bg-card p-4 shadow-sm"></div>
        <div className="min-h-24 rounded-lg border border-t-4 border-t-blue-chill bg-card p-4 shadow-sm"></div>
      </div>

      <div className="grid h-full grid-cols-[2fr_1fr] gap-4">
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
