import { LayoutDashboard, Briefcase, Clock, FileText, Users, TrendingUp, BarChart2 } from 'lucide-react';
import clsx from 'clsx';
// import { Link, useLocation } from 'react-router-dom'; // Using simple state for prototype if easier, but lets use Router
import { Link, useLocation } from 'react-router-dom';

// ... (comment lines removal)

const NAV_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Projects', icon: Briefcase, path: '/projects' },
    { label: 'Services', icon: Clock, path: '/services' },
    { label: 'Invoices', icon: FileText, path: '/invoices' },
    { label: 'Resources', icon: Users, path: '/resources' },
    { label: 'Sales', icon: TrendingUp, path: '/sales' },
    { label: 'Reports', icon: BarChart2, path: '/reports' },
];

export function Sidebar() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <aside className="w-64 bg-[var(--bg-sidebar)] text-white flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6">
                <h2 className="text-xl font-bold tracking-tight text-white/90">Vertec<span className="text-[hsl(var(--hue-primary),80%,60%)]">.cc</span></h2>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={clsx(
                            "flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors",
                            currentPath === item.path
                                ? "bg-white/10 text-white"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 mt-auto border-t border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
                    <div className="text-sm">
                        <div className="font-medium">Pierre Guiol</div>
                        <div className="text-xs text-white/50">Admin</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
