import { LinksFunction } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from '@remix-run/react';

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

export function Layout({ children }: { children: React.ReactNode }) {
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
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
