import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="min-h-screen bg-[var(--bg-app)] pl-64">
            <Sidebar />
            <main className="p-8 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}
