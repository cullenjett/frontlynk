import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, Link, NavLink, Outlet, useLoaderData } from '@remix-run/react';
import { FileBadge, LayoutGrid, User } from 'lucide-react';

import { GeneralErrorBoundary } from '~/components/error-boundary';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';
import { logout, requireAuth } from '~/lib/session.server';
import { cn } from '~/lib/styles';
import { createToastHeaders } from '~/lib/toast.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { user } = await requireAuth(request);
  return json({ user });
}

export async function action({ request }: ActionFunctionArgs) {
  await logout(request, {
    headers: await createToastHeaders({
      type: 'message',
      title: 'You are now signed out'
    })
  });
}

export default function DashboardLayout() {
  return (
    <div className="flex h-screen w-full flex-col overflow-auto bg-muted">
      <Sidebar />

      <div className="relative flex h-full flex-col sm:pl-56">
        <Header />

        <main className="container flex flex-1 flex-col gap-4 px-4 py-6 pt-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="fixed left-56 right-0 top-0 bg-background">
      <div className="container flex items-center px-6 py-4">
        <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>

        <div className="ml-auto">
          <AccountDropdown />
        </div>
      </div>
    </header>
  );
}

function AccountDropdown() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full"
          aria-label="My account menu"
        >
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel>
          My Account
          <div className="text-xs font-medium text-muted-foreground">
            {user.email}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="focus-visible:ring-0" to="/dashboard/settings">
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="focus-visible:ring-0" to="/dashboard/help">
            Help
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Form method="post">
          <DropdownMenuItem asChild>
            <button
              type="submit"
              className="w-full text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              Logout
            </button>
          </DropdownMenuItem>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-56 flex-col bg-background sm:flex">
      <nav className="flex flex-col items-center gap-2 px-2 py-4">
        <Link
          to="/dashboard"
          className="mb-16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <img
            className="rounded-full"
            src="https://placehold.co/120x120"
            alt="Logo"
            width="120"
            height="120"
          />
        </Link>

        <NavItem to="/dashboard" icon={<LayoutGrid className="size-5" />}>
          Overview
        </NavItem>

        <NavItem
          to="/dashboard/certificates"
          icon={<FileBadge className="size-5" />}
        >
          Certificates
        </NavItem>
      </nav>
    </aside>
  );
}

function NavItem({
  to,
  icon,
  children
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          'flex w-full items-center gap-5 rounded-lg p-3 pl-8 no-underline transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': isActive
          }
        )
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
