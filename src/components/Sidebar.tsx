import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart,
  Truck,
  Globe,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wine,
  Receipt,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/inventory', icon: Package, label: 'Inventory' },
  { to: '/pos', icon: ShoppingCart, label: 'Point of Sale' },
  { to: '/sales-history', icon: Receipt, label: 'Sales History' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/analytics', icon: BarChart, label: 'Analytics' },
  { to: '/suppliers', icon: Truck, label: 'Suppliers' },
  { to: '/ecommerce', icon: Globe, label: 'E-commerce' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];
export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  return (
    <TooltipProvider>
      <aside
        className={cn(
          'relative flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out h-screen',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border h-16">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Wine className="h-8 w-8 text-gold" />
              <h1 className="text-xl font-display font-bold text-foreground">
                Hellena's Bistro
              </h1>
            </div>
          )}
          {isCollapsed && <Wine className="h-8 w-8 text-gold mx-auto" />}
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => (
            <Tooltip key={item.to} delayDuration={0}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      'hover:bg-muted hover:text-gold',
                      isActive ? 'bg-muted text-gold' : 'text-muted-foreground',
                      isCollapsed && 'justify-center'
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>
        <div className="p-4 border-t border-border mt-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="w-full flex justify-center"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}