import { GeneralErrorBoundary } from '~/components/error-boundary';

export default function DashboardSplat() {
  return (
    <GeneralErrorBoundary
      unexpectedErrorHandler={() => <p>Page not found</p>}
    />
  );
}
