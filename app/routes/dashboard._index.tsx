import { GeneralErrorBoundary } from '~/components/error-boundary';
import { Card } from '~/components/ui/card';

export default function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <Card className="min-h-24" decoration="blue"></Card>
        <Card className="min-h-24" decoration="orange"></Card>
        <Card className="min-h-24" decoration="dark"></Card>
        <Card className="min-h-24" decoration="green"></Card>
      </div>

      <div className="grid h-full grid-cols-[2fr_1fr] gap-4">
        <Card title="Onboarding"></Card>
        <Card title="Recent Activity"></Card>
      </div>
    </>
  );
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
