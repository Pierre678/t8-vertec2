import { useState } from 'react';
import { useDatabase } from '../../lib/store';
import { Plus } from 'lucide-react';

export function ResourceView() {
    const { users, projects, allocations, addAllocation } = useDatabase();
    const [showAddModal, setShowAddModal] = useState(false); // Simple inline toggle for now

    // Calculate generic utilization per user per month (Placeholder logic)
    // In a real app, we'd have a specific date range filter.

    const handleAddAllocation = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const userId = formData.get('userId') as string;
        const projectId = formData.get('projectId') as string;
        const percentage = Number(formData.get('percentage'));
        const startDate = formData.get('startDate') as string;
        const endDate = formData.get('endDate') as string;

        if (userId && projectId && percentage) {
            addAllocation({
                id: `al${Math.floor(Math.random() * 10000)}`,
                userId,
                projectId,
                percentage,
                startDate,
                endDate
            });
            setShowAddModal(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-main)]">Resource Planning</h1>
                    <p className="text-[var(--text-muted)]">Manage team capacity and project allocations.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(!showAddModal)}
                    className="flex items-center gap-2 bg-[hsl(var(--hue-primary),60%,50%)] text-white px-4 py-2 rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
                >
                    <Plus size={18} />
                    <span>Allocate Resource</span>
                </button>
            </div>

            {showAddModal && (
                <div className="mb-8 p-6 bg-white rounded-[var(--radius-md)] border border-[var(--border-light)] shadow-sm">
                    <h3 className="font-bold mb-4">New Allocation</h3>
                    <form onSubmit={handleAddAllocation} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium mb-1">User</label>
                            <select name="userId" className="w-full px-3 py-2 border rounded" required>
                                <option value="">Select User...</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Project</label>
                            <select name="projectId" className="w-full px-3 py-2 border rounded" required>
                                <option value="">Select Project...</option>
                                {projects.filter(p => p.status === 'active').map(p => <option key={p.id} value={p.id}>{p.code}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Date</label>
                            <input type="date" name="startDate" className="w-full px-3 py-2 border rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Load %</label>
                            <input type="number" name="percentage" min="0" max="100" defaultValue="100" className="w-full px-3 py-2 border rounded" required />
                        </div>
                        <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded">Add</button>
                    </form>
                </div>
            )}

            {/* Grid View */}
            <div className="bg-white rounded-[var(--radius-md)] border border-[var(--border-light)] overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[var(--bg-app)] border-b border-[var(--border-light)]">
                        <tr>
                            <th className="p-4 font-medium w-1/4">Resource</th>
                            <th className="p-4 font-medium border-l border-r border-[var(--border-light)] text-center w-1/4">Jan 2024</th>
                            <th className="p-4 font-medium border-r border-[var(--border-light)] text-center w-1/4">Feb 2024</th>
                            <th className="p-4 font-medium text-center w-1/4">Mar 2024</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                        {users.map(user => {
                            const userAllocations = allocations.filter(a => a.userId === user.id);
                            // Simple accumulation of % for now regardless of precise date overlap, just to show UI
                            const totalLoad = userAllocations.reduce((acc, curr) => acc + curr.percentage, 0);

                            return (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div>{user.name}</div>
                                            <div className="text-[var(--text-muted)] text-xs font-normal">{user.role}</div>
                                        </div>
                                    </td>
                                    {/* Mock Time Columns */}
                                    {[1, 2, 3].map(month => (
                                        <td key={month} className="p-4 border-l border-[var(--border-light)] text-center relative group">
                                            {userAllocations.length > 0 ? (
                                                <div className="space-y-1">
                                                    {userAllocations.map(alloc => {
                                                        const proj = projects.find(p => p.id === alloc.projectId);
                                                        return (
                                                            <div key={alloc.id} className="bg-blue-100 text-blue-700 text-xs py-1 px-2 rounded truncate" title={`${proj?.title}: ${alloc.percentage}%`}>
                                                                {proj?.code} ({alloc.percentage}%)
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ) : (
                                                <span className="text-[var(--text-muted)] text-xs">-</span>
                                            )}

                                            {totalLoad > 0 && (
                                                <div className={`mt-2 h-1 rounded-full ${totalLoad > 100 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(totalLoad, 100)}%` }} />
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
