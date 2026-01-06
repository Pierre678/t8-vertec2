import { useState } from 'react';
import { useDatabase } from '../../lib/store';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { ServiceEntry } from '../../types';

export function TimeTracker() {
    const { projects, phases, serviceTypes, serviceEntries, addServiceEntry } = useDatabase();

    // Default new entry state
    const [newEntry, setNewEntry] = useState<Partial<ServiceEntry>>({
        date: new Date().toISOString().split('T')[0],
        userId: 'u1', // Default to current user
        minutes: 60,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEntry.projectId || !newEntry.serviceTypeId || !newEntry.date) return;

        addServiceEntry({
            ...newEntry,
            id: `se${Math.floor(Math.random() * 10000)}`,
            billed: false,
            phaseId: newEntry.phaseId || 'ph1', // Fallback/Default phase logic
            description: newEntry.description || ''
        } as ServiceEntry);

        // Reset some fields
        setNewEntry(prev => ({ ...prev, description: '' }));
    };

    const myEntries = serviceEntries.filter(e => e.userId === 'u1');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Entry Form */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-[var(--radius-md)] border border-[var(--border-light)] shadow-sm sticky top-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Clock className="text-[hsl(var(--hue-primary),60%,50%)]" />
                        Log Time
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-sm)]"
                                value={newEntry.date}
                                onChange={e => setNewEntry({ ...newEntry, date: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Project</label>
                            <select
                                required
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-sm)] bg-white"
                                value={newEntry.projectId || ''}
                                onChange={e => setNewEntry({ ...newEntry, projectId: e.target.value })}
                            >
                                <option value="">Select Project...</option>
                                {projects.filter(p => p.status === 'active').map(p => (
                                    <option key={p.id} value={p.id}>{p.code} - {p.title}</option>
                                ))}
                            </select>
                        </div>

                        {newEntry.projectId && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Phase</label>
                                <select
                                    className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-sm)] bg-white"
                                    value={newEntry.phaseId || ''}
                                    onChange={e => setNewEntry({ ...newEntry, phaseId: e.target.value })}
                                >
                                    <option value="">Select Phase...</option>
                                    {phases.filter(ph => ph.projectId === newEntry.projectId).map(ph => (
                                        <option key={ph.id} value={ph.id}>{ph.code} - {ph.description}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1">Service Type</label>
                            <select
                                required
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-sm)] bg-white"
                                value={newEntry.serviceTypeId || ''}
                                onChange={e => setNewEntry({ ...newEntry, serviceTypeId: e.target.value })}
                            >
                                <option value="">Select Type...</option>
                                {serviceTypes.map(st => (
                                    <option key={st.id} value={st.id}>{st.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Minutes</label>
                                <input
                                    type="number"
                                    step="15"
                                    className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-sm)]"
                                    value={newEntry.minutes}
                                    onChange={e => setNewEntry({ ...newEntry, minutes: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="pt-8 text-sm text-[var(--text-muted)]">
                                = {(newEntry.minutes || 0) / 60} hrs
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-sm)]"
                                rows={3}
                                value={newEntry.description || ''}
                                onChange={e => setNewEntry({ ...newEntry, description: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[hsl(var(--hue-primary),60%,50%)] text-white py-2 rounded-[var(--radius-sm)] hover:opacity-90">
                            <Plus size={18} />
                            Save Entry
                        </button>
                    </form>
                </div>
            </div>

            {/* List View */}
            <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">My Services</h1>
                    <div className="text-[var(--text-muted)]">
                        Total: {myEntries.reduce((acc, curr) => acc + (curr.minutes / 60), 0).toFixed(2)} hrs
                    </div>
                </div>

                <div className="bg-white rounded-[var(--radius-md)] border border-[var(--border-light)] overflow-hidden">
                    {myEntries.length === 0 ? (
                        <div className="p-8 text-center text-[var(--text-muted)]">No entries found. Start logging!</div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[var(--bg-app)] border-b border-[var(--border-light)]">
                                <tr>
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Project</th>
                                    <th className="p-4 font-medium">Description</th>
                                    <th className="p-4 font-medium text-right">Hours</th>
                                    <th className="p-4 font-medium w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-light)]">
                                {myEntries.map(entry => {
                                    const project = projects.find(p => p.id === entry.projectId);
                                    const type = serviceTypes.find(t => t.id === entry.serviceTypeId);
                                    return (
                                        <tr key={entry.id} className="hover:bg-gray-50">
                                            <td className="p-4">{entry.date}</td>
                                            <td className="p-4">
                                                <div className="font-medium">{project?.code}</div>
                                                <div className="text-[var(--text-muted)] text-xs">{type?.name}</div>
                                            </td>
                                            <td className="p-4">{entry.description}</td>
                                            <td className="p-4 text-right font-medium">{(entry.minutes / 60).toFixed(2)}</td>
                                            <td className="p-4 text-[var(--text-muted)] hover:text-red-500 cursor-pointer">
                                                <Trash2 size={16} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
