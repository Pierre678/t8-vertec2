import { useState } from 'react';
import { TimeTracker } from './TimeTracker';
import { Receipt } from 'lucide-react';

export function ServicesOverview() {
    const [activeTab, setActiveTab] = useState<'time' | 'expenses'>('time');

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-main)]">Services & Expenses</h1>
                    <p className="text-[var(--text-muted)]">Record your hours and project expenses.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-[var(--border-light)] mb-6">
                <div className="flex gap-6">
                    <button
                        onClick={() => setActiveTab('time')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'time'
                                ? 'border-[hsl(var(--hue-primary),60%,50%)] text-[hsl(var(--hue-primary),60%,50%)]'
                                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                            }`}
                    >
                        Time Tracking
                    </button>
                    <button
                        onClick={() => setActiveTab('expenses')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'expenses'
                                ? 'border-[hsl(var(--hue-primary),60%,50%)] text-[hsl(var(--hue-primary),60%,50%)]'
                                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                            }`}
                    >
                        Expenses
                    </button>
                </div>
            </div>

            {activeTab === 'time' ? (
                <TimeTracker />
            ) : (
                <div className="p-12 text-center border-2 border-dashed border-[var(--border-light)] rounded-[var(--radius-md)]">
                    <Receipt className="mx-auto h-12 w-12 text-[var(--text-muted)] mb-4" />
                    <h3 className="text-lg font-medium">Expense Tracking</h3>
                    <p className="text-[var(--text-muted)]">The expense tracking module is under construction.</p>
                </div>
            )}
        </div>
    );
}
