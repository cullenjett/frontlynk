import { GeneralErrorBoundary } from '~/components/error-boundary';
import { Card } from '~/components/ui/card';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-4">
        <Card className="min-h-24" decoration="primary"></Card>
        <Card className="min-h-24" decoration="secondary"></Card>
        <Card className="min-h-24" decoration="dark"></Card>
        <Card className="min-h-24" decoration="success"></Card>
      </div>

      <div className="grid flex-1 grid-cols-[2fr_1fr] gap-4">
        <Card></Card>
        <Card></Card>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
