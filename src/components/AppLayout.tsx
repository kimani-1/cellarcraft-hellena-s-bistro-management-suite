import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex">
      <Sidebar />
      <div className="flex-1 flex flex-col max-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')]">
          {children}
        </main>
      </div>
    </div>
  );
}