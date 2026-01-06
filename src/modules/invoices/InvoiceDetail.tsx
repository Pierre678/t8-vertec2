import { useParams, Link } from 'react-router-dom';
import { useDatabase } from '../../lib/store';
import { ArrowLeft, Printer, Send, CreditCard } from 'lucide-react';

export function InvoiceDetail() {
    const { id } = useParams<{ id: string }>();
    const { invoices, projects, updateInvoiceStatus } = useDatabase();
    const invoice = invoices.find(i => i.id === id);
    const project = projects.find(p => p.id === invoice?.projectId);

    if (!invoice) return <div>Invoice not found</div>;

    return (
        <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-6">
                <Link to="/invoices" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                    <ArrowLeft size={16} />
                    Back to Invoices
                </Link>
                <div className="flex gap-2">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-light)] rounded-[var(--radius-sm)] bg-white"
                    >
                        <Printer size={16} /> Print
                    </button>
                    {invoice.status === 'draft' && (
                        <button
                            onClick={() => updateInvoiceStatus(invoice.id, 'open')}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-[var(--radius-sm)]"
                        >
                            <Send size={16} /> Send Invoice
                        </button>
                    )}
                    {invoice.status === 'open' && (
                        <button
                            onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-[var(--radius-sm)]"
                        >
                            <CreditCard size={16} /> Mark Paid
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white p-12 rounded-[var(--radius-md)] shadow-sm border border-[var(--border-light)]" id="invoice-preview">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-[hsl(var(--hue-primary),60%,20%)] mb-2">INVOICE</h1>
                        <p className="text-[var(--text-muted)]">#{invoice.number}</p>
                        <div className={`mt-4 inline-block px-3 py-1 rounded text-sm font-medium uppercase tracking-wide border ${invoice.status === 'paid' ? 'border-green-200 text-green-700 bg-green-50' :
                                invoice.status === 'open' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                                    'border-gray-200 text-gray-700 bg-gray-50'
                            }`}>
                            {invoice.status}
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="font-bold text-lg">Vertec Copycat Ltd.</h2>
                        <p className="text-[var(--text-muted)] text-sm">Zurich, Switzerland</p>
                        <p className="text-[var(--text-muted)] text-sm">info@verteccopycat.com</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div>
                        <h3 className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Bill To</h3>
                        <p className="font-medium text-lg mb-1">{project?.clientId || 'Client Name'}</p>
                        <p className="text-gray-600">Sample Address Line 1</p>
                        <p className="text-gray-600">8000 Zurich</p>
                    </div>
                    <div className="text-right">
                        <div className="mb-2">
                            <span className="text-[var(--text-muted)] mr-4">Invoice Date:</span>
                            <span className="font-medium">{invoice.date}</span>
                        </div>
                        <div>
                            <span className="text-[var(--text-muted)] mr-4">Due Date:</span>
                            <span className="font-medium">{invoice.dueDate}</span>
                        </div>
                    </div>
                </div>

                <table className="w-full mb-8">
                    <thead>
                        <tr className="border-b-2 border-[var(--border-light)]">
                            <th className="text-left py-3 font-bold text-sm uppercase text-[var(--text-muted)]">Description</th>
                            <th className="text-right py-3 font-bold text-sm uppercase text-[var(--text-muted)]">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-[var(--border-light)]">
                            <td className="py-4">
                                <div className="font-medium">Professional Services</div>
                                <div className="text-sm text-[var(--text-muted)]">Project: {project?.title}</div>
                            </td>
                            <td className="text-right py-4 font-medium">CHF {invoice.totalAmount.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="flex justify-end">
                    <div className="w-1/2">
                        <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
                            <span className="font-medium">Total</span>
                            <span className="font-bold text-xl">CHF {invoice.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[var(--border-light)] text-center text-[var(--text-muted)] text-sm">
                    <p>Thank you for your business!</p>
                    <p>Payment details: IBAN CH00 0000 0000 0000 0</p>
                </div>
            </div>
        </div>
    );
}
