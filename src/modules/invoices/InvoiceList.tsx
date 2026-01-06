import { Link } from 'react-router-dom';
import { useDatabase } from '../../lib/store';
import { Plus, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { InvoiceStatus } from '../../types';

export function InvoiceList() {
    const { invoices, projects } = useDatabase();

    const getStatusColor = (status: InvoiceStatus) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'open': return 'bg-blue-100 text-blue-700';
            case 'draft': return 'bg-gray-100 text-gray-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: InvoiceStatus) => {
        switch (status) {
            case 'paid': return <CheckCircle size={16} />;
            case 'open': return <Clock size={16} />;
            case 'draft': return <FileText size={16} />;
            case 'cancelled': return <AlertCircle size={16} />;
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-main)]">Invoices</h1>
                    <p className="text-[var(--text-muted)]">Manage client billing and payments.</p>
                </div>
                <Link to="/invoices/new" className="flex items-center gap-2 bg-[hsl(var(--hue-primary),60%,50%)] text-white px-4 py-2 rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity">
                    <Plus size={18} />
                    <span>New Invoice</span>
                </Link>
            </div>

            <div className="bg-white rounded-[var(--radius-md)] border border-[var(--border-light)] overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[var(--bg-app)] border-b border-[var(--border-light)]">
                        <tr>
                            <th className="p-4 font-medium">Number</th>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">Project</th>
                            <th className="p-4 font-medium text-right">Amount</th>
                            <th className="p-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                        {invoices.map(invoice => {
                            const project = projects.find(p => p.id === invoice.projectId);
                            return (
                                <tr key={invoice.id} className="hover:bg-gray-50 group">
                                    <td className="p-4">
                                        <Link to={`/invoices/${invoice.id}`} className="font-medium text-[hsl(var(--hue-primary),60%,50%)] hover:underline">
                                            {invoice.number}
                                        </Link>
                                    </td>
                                    <td className="p-4">{invoice.date}</td>
                                    <td className="p-4">{project?.title || 'Unknown Project'}</td>
                                    <td className="p-4 text-right font-medium">CHF {invoice.totalAmount.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(invoice.status)}`}>
                                            {getStatusIcon(invoice.status)}
                                            {invoice.status}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
