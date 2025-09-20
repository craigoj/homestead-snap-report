import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Home, Shield, Package, Plus, FileText, Settings, LogOut, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Properties', href: '/properties', icon: Package },
  { name: 'Add Asset', href: '/assets/add', icon: Plus },
  { name: 'Reports', href: '/reports', icon: FileText },
];

export const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r bg-card">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <div className="flex items-center space-x-2">
                <Home className="h-8 w-8 text-primary" />
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">CTRL Tech</span>
              </div>
            </div>
            <nav className="mt-8 flex-1 space-y-1 px-2">
              <NavLinks />
            </nav>
          </div>
          <div className="flex-shrink-0 border-t p-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="flex items-center justify-between bg-card border-b px-4 py-3">
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-semibold">CTRL Tech</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex items-center space-x-2 mb-8">
                <Home className="h-6 w-6 text-primary" />
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-semibold">CTRL Tech</span>
              </div>
              <nav className="space-y-2">
                <NavLinks />
              </nav>
              <div className="absolute bottom-4 left-4 right-4 border-t pt-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64">
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};