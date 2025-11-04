import { useLocation } from 'react-router-dom';
import { UserNav } from './UserNav';
const getTitleFromPathname = (pathname: string) => {
  if (pathname === '/') return 'Dashboard';
  const title = pathname.replace('/', '').replace(/-/g, ' ');
  return title.charAt(0).toUpperCase() + title.slice(1);
};
export function Header() {
  const location = useLocation();
  const title = getTitleFromPathname(location.pathname);
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/60 px-6 backdrop-blur-md">
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <UserNav />
      </div>
    </header>
  );
}