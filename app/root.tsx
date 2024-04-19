import { LinksFunction, LoaderFunctionArgs, json } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData
} from '@remix-run/react';
import { useEffect } from 'react';
import { toast as showToast } from 'sonner';

import { GeneralErrorBoundary } from '~/components/error-boundary';
import { Toaster } from '~/components/ui/sonner';
import { getPublicEnv } from '~/lib/env.server';
import { Toast, getToastFromRequest } from '~/lib/toast.server';

import tailwind from './tailwind.css?url';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'preload',
      href: '/fonts/inter.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    },
    { rel: 'stylesheet', href: tailwind }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { toast, headers: toastHeaders } = await getToastFromRequest(request);

  return json(
    {
      ENV: getPublicEnv(),
      toast
    },
    {
      headers: toastHeaders ?? undefined
    }
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>('root');

  useToast(data?.toast);

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full min-h-full">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data?.ENV)}`
          }}
        />
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

function useToast(toast?: Toast | null) {
  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        showToast[toast.type](toast.title, {
          id: toast.id,
          description: toast.description,
          duration: toast.duration
        });
      }, 0);
    }
  }, [toast]);
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
