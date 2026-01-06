import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDatabase } from '../../lib/store';
import { ArrowLeft, FileText } from 'lucide-react';
import { Invoice } from '../../types';

export function InvoiceGenerator() {
    const navigate = useNavigate();
    const { projects, serviceEntries, addInvoice } = useDatabase();
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');

    // STEP 1: Select Project
    // STEP 2: Review Services (Stubbed for now, just takes total)

    const selectedProject = projects.find(p => p.id === selectedProjectId);

    // Calculcate unbilled stats for selection
    const unbilledMinutes = serviceEntries
        .filter(e => e.projectId === selectedProjectId && !e.billed)
        .reduce((acc, curr) => acc + curr.minutes, 0);

    // Mock calculation - standard rate assumption since we don't have it easily linked here in the reduce
    const estimatedAmount = (unbilledMinutes / 60) * 150;

    const handleCreateInvoice = () => {
        if (!selectedProject) return;

        const newInvoice: Invoice = {
            id: `inv${Math.floor(Math.random() * 10000)}`,
            number: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            projectId: selectedProjectId,
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'draft',
            totalAmount: estimatedAmount,
            items: [] // TODO: Add items
        };

        addInvoice(newInvoice);
        navigate(`/invoices/${newInvoice.id}`);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link to="/invoices" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] mb-4 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Invoices
                </Link>
                <h1 className="text-3xl font-bold text-[var(--text-main)]">New Invoice</h1>
                <p className="text-[var(--text-muted)]">Create an invoice from unbilled services.</p>
            </div>

            <div className="bg-white p-8 rounded-[var(--radius-md)] border border-[var(--border-light)] shadow-sm space-y-8">
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-[var(--text-main)]">Select Project</label>
                    <select
                        className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-sm)] bg-white focus:outline-none focus:border-[var(--border-focus)] transition-colors"
                        value={selectedProjectId}
                        onChange={e => setSelectedProjectId(e.target.value)}
                        size={5}
                    >
                        {projects.map(p => (
                            <option key={p.id} value={p.id} className="p-2">
                                {p.code} - {p.title}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedProjectId && (
                    <div className="p-4 bg-[var(--bg-app)] rounded-[var(--radius-sm)] border border-[var(--border-light)]">
                        <h3 className="font-semibold mb-2">Unbilled Summary</h3>
                        <div className="flex justify-between mb-1 text-sm">
                            <span className="text-[var(--text-muted)]">Unbilled Hours:</span>
                            <span>{(unbilledMinutes / 60).toFixed(2)} hrs</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-muted)]">Est. Amount:</span>
                            <span className="font-bold">CHF {estimatedAmount.toLocaleString()}</span>
                        </div>
                    </div>
                )}

                <div className="pt-4 flex justify-end">
                    <button
                        onClick={handleCreateInvoice}
                        disabled={!selectedProjectId || unbilledMinutes === 0}
                        className="flex items-center gap-2 bg-[hsl(var(--hue-primary),60%,50%)] text-white px-6 py-2 rounded-[var(--radius-sm)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <FileText size={18} />
                        <span>Generate Draft Invoice</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
