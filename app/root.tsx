import { LinksFunction, LoaderFunctionArgs, json } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from '@remix-run/react';
import { useEffect } from 'react';
import { toast as showToast } from 'sonner';

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
  const data = useLoaderData<typeof loader>();

  useToast(data.toast);

  return (
    <html lang="en" className="antialiased h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-full h-full">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`
          }}
        />
        <Toaster richColors expand />
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
          description: toast.description
        });
      }, 0);
    }
  }, [toast]);
}
