import {
  type ErrorResponse,
  isRouteErrorResponse,
  useParams,
  useRouteError
} from '@remix-run/react';
import { ServerCrash } from 'lucide-react';

type StatusHandler = (info: {
  error: ErrorResponse;
  params: Record<string, string | undefined>;
}) => JSX.Element | null;

function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error;
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }
  console.error('Unable to get error message for error', error);
  return 'Unknown Error';
}

export function GeneralErrorBoundary({
  defaultStatusHandler = ({ error }) => (
    <p>
      {error.status} {error.data}
    </p>
  ),
  statusHandlers,
  unexpectedErrorHandler = (error) => <p>{getErrorMessage(error)}</p>
}: {
  defaultStatusHandler?: StatusHandler;
  statusHandlers?: Record<number, StatusHandler>;
  unexpectedErrorHandler?: (error: unknown) => JSX.Element | null;
}) {
  const error = useRouteError();
  const params = useParams();

  if (typeof document !== 'undefined' && error) {
    console.error(error);
  }

  return (
    <div className="flex h-full items-center justify-center rounded bg-red-100 px-5">
      <div className="grid max-w-[420px] gap-4 text-pretty text-center text-lg">
        <ServerCrash className="m-auto size-8 text-destructive" />

        {isRouteErrorResponse(error)
          ? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
              error,
              params
            })
          : unexpectedErrorHandler(error)}
      </div>
    </div>
  );
}
