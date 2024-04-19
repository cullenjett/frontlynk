import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json
} from '@remix-run/node';
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation
} from '@remix-run/react';
import { Contact, FileBadge, LayoutGrid, PanelLeft, User } from 'lucide-react';
import { useState } from 'react';

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
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';
import { logout, requireAuth } from '~/lib/session.server';
import { cn } from '~/lib/styles';
import { createToastHeaders } from '~/lib/toast.server';

export const meta: MetaFunction = () => {
  return [{ title: 'Dashboard' }];
};

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
    <div className="flex h-screen bg-muted">
      <Sidebar />

      <div className="relative flex h-full flex-1 flex-col">
        <Header />

        <main className="container grid max-h-full flex-1 overflow-y-auto py-6 md:px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const pathToTitle: Record<string, React.ReactNode> = {
  '/dashboard': 'Dashboard',
  '/dashboard/network': 'Network',
  '/dashboard/certificates': 'Certificates',
  '/dashboard/settings': 'Settings',
  '/dashboard/help': 'Help'
};

function Header() {
  const location = useLocation();
  const path = location.pathname;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky left-56 right-0 top-0 bg-background shadow-md">
      <div className="container flex items-center gap-6 py-4 md:px-6">
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="md:hidden">
              <PanelLeft className="s-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="px-4 pt-12 sm:max-w-xs">
            <nav className="grid gap-1">
              <NavItem
                to="/dashboard"
                icon={<LayoutGrid className="size-5" />}
                onClick={() => setMobileNavOpen(false)}
              >
                Overview
              </NavItem>

              <NavItem
                to="/dashboard/network"
                icon={<Contact className="size-5" />}
                onClick={() => setMobileNavOpen(false)}
              >
                Network
              </NavItem>

              <NavItem
                to="/dashboard/certificates"
                icon={<FileBadge className="size-5" />}
                onClick={() => setMobileNavOpen(false)}
              >
                Certificates
              </NavItem>
            </nav>
          </SheetContent>
        </Sheet>

        <h1 className="hidden text-xl font-bold tracking-tight sm:block">
          {pathToTitle[path] || 'Dashboard'}
        </h1>

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
          aria-label="Account menu"
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
    <aside className="sticky bottom-0 left-0 top-0 z-10 hidden w-56 flex-col overflow-y-auto bg-background md:flex">
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

        <NavItem to="/dashboard/network" icon={<Contact className="size-5" />}>
          Network
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
  onClick,
  children
}: {
  to: string;
  icon: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex w-full items-center gap-5 rounded-sm p-3 pl-8 no-underline transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
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
