import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDatabase } from '../../lib/store';
import { ArrowLeft, Save } from 'lucide-react';
import { Project, ProjectType } from '../../types';

export function ProjectEditor() {
    const { id } = useParams<{ id: string }>();
    const isNew = !id;
    const navigate = useNavigate();
    const { projects, addProject, updateProject } = useDatabase();

    const existingProject = projects.find(p => p.id === id);

    const [formData, setFormData] = useState<Partial<Project>>(
        existingProject || {
            code: '',
            title: '',
            type: 'fixed_price' as ProjectType,
            status: 'active',
            startDate: new Date().toISOString().split('T')[0],
            budgetFees: 0,
            budgetExpenses: 0,
            leaderId: 'u1', // Default
            clientId: 'c1' // Default
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isNew) {
            const newProject: Project = {
                ...formData as Project,
                id: `p${Math.floor(Math.random() * 1000)}`, // Simple ID gen
            };
            addProject(newProject);
            navigate('/projects');
        } else if (id) {
            updateProject(id, formData);
            navigate(`/projects/${id}`);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link to="/projects" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] mb-4 transition-colors">
                    <ArrowLeft size={16} />
                    Cancel
                </Link>
                <h1 className="text-3xl font-bold text-[var(--text-main)]">
                    {isNew ? 'New Project' : 'Edit Project'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[var(--radius-md)] border border-[var(--border-light)] shadow-sm space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Project Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-sm)] focus:outline-none focus:border-[var(--border-focus)]"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Project Code</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-sm)] focus:outline-none focus:border-[var(--border-focus)]"
                            value={formData.code}
                            onChange={e => setFormData({ ...formData, code: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Type</label>
                        <select
                            className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-sm)] focus:outline-none focus:border-[var(--border-focus)] bg-white"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value as ProjectType })}
                        >
                            <option value="fixed_price">Fixed Price</option>
                            <option value="time_material">Time & Material</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Start Date</label>
                        <input
                            type="date"
                            required
                            className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-sm)] focus:outline-none focus:border-[var(--border-focus)]"
                            value={formData.startDate}
                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-main)] mb-1">End Date (Optional)</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-sm)] focus:outline-none focus:border-[var(--border-focus)]"
                            value={formData.endDate || ''}
                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Fee Budget</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-[var(--text-muted)]">CHF</span>
                            <input
                                type="number"
                                className="w-full pl-12 pr-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-sm)] focus:outline-none focus:border-[var(--border-focus)]"
                                value={formData.budgetFees}
                                onChange={e => setFormData({ ...formData, budgetFees: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Expense Budget</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-[var(--text-muted)]">CHF</span>
                            <input
                                type="number"
                                className="w-full pl-12 pr-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-sm)] focus:outline-none focus:border-[var(--border-focus)]"
                                value={formData.budgetExpenses}
                                onChange={e => setFormData({ ...formData, budgetExpenses: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-[var(--border-light)]">
                    <button
                        type="button"
                        onClick={() => navigate('/projects')}
                        className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-[hsl(var(--hue-primary),60%,50%)] text-white px-6 py-2 rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
                    >
                        <Save size={18} />
                        <span>Save Project</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
