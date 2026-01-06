import { useDatabase } from '../../lib/store';
import { BarChart, PieChart, Activity, TrendingUp } from 'lucide-react';

export function ReportViewer() {
    const { projects, invoices, opportunities } = useDatabase();

    // Mock Calculations for BI
    const totalRevenue = invoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const openInvoices = invoices.filter(i => i.status === 'open').reduce((acc, curr) => acc + curr.totalAmount, 0);
    const pipelineValue = opportunities.reduce((acc, curr) => acc + curr.expectedVolume, 0);

    // Group projects by type
    const projectsByType = projects.reduce((acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-main)]">Controlling & BI</h1>
                    <p className="text-[var(--text-muted)]">Key performance indicators and reports.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-[var(--radius-md)] border border-[var(--border-light)] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-[var(--text-muted)]">Total Invoiced</h3>
                        <Activity size={20} className="text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-[var(--text-main)]">CHF {totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                        <TrendingUp size={14} /> +12% vs last month
                    </p>
                </div>

                <div className="bg-white p-6 rounded-[var(--radius-md)] border border-[var(--border-light)] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-[var(--text-muted)]">Outstanding (Open)</h3>
                        <BarChart size={20} className="text-orange-500" />
                    </div>
                    <p className="text-3xl font-bold text-[var(--text-main)]">CHF {openInvoices.toLocaleString()}</p>
                    <p className="text-sm text-[var(--text-muted)] mt-2">
                        {invoices.filter(i => i.status === 'open').length} invoices pending
                    </p>
                </div>

                <div className="bg-white p-6 rounded-[var(--radius-md)] border border-[var(--border-light)] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-[var(--text-muted)]">Sales Pipeline</h3>
                        <PieChart size={20} className="text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold text-[var(--text-main)]">CHF {pipelineValue.toLocaleString()}</p>
                    <p className="text-sm text-[var(--text-muted)] mt-2">
                        Weighted: CHF {(pipelineValue * 0.4).toLocaleString()} (est.)
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-[var(--radius-md)] border border-[var(--border-light)] shadow-sm">
                    <h3 className="font-bold mb-6">Project Portfolio Mix</h3>
                    <div className="space-y-4">
                        {Object.entries(projectsByType).map(([type, count]) => (
                            <div key={type} className="flex items-center">
                                <div className="w-32 capitalize text-sm">{type.replace('_', ' ')}</div>
                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[hsl(var(--hue-primary),70%,50%)]"
                                        style={{ width: `${(count / projects.length) * 100}%` }}
                                    />
                                </div>
                                <div className="w-12 text-right text-sm font-medium">{count}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[var(--radius-md)] border border-[var(--border-light)] shadow-sm">
                    <h3 className="font-bold mb-4">Top Customers (Revenue)</h3>
                    <div className="h-48 flex items-center justify-center text-[var(--text-muted)] italic bg-gray-50 rounded border border-dashed border-gray-200">
                        Chart Placeholder (Recharts integration required)
                    </div>
                </div>
            </div>
        </div>
    );
}
