import { useState } from 'react';
import { useDatabase } from '../../lib/store';
import { Plus, Folder, Calendar, DollarSign, User } from 'lucide-react';
import { Project } from '../../types';
import { Link } from 'react-router-dom';

export function ProjectList() {
    const { projects } = useDatabase();
    const [filter, setFilter] = useState('');

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(filter.toLowerCase()) ||
        p.code.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-main)]">Projects</h1>
                    <p className="text-[var(--text-muted)]">Manage your mandates and cases.</p>
                </div>
                <button className="flex items-center gap-2 bg-[hsl(var(--hue-primary),60%,50%)] text-white px-4 py-2 rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity">
                    <Plus size={18} />
                    <span>New Project</span>
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search projects..."
                    className="w-full max-w-md px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-sm)] focus:outline-none focus:border-[var(--border-focus)] transition-colors"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
}

function ProjectCard({ project }: { project: Project }) {
    return (
        <Link to={`/projects/${project.id}`} className="block group">
            <div className="bg-white p-6 rounded-[var(--radius-md)] border border-[var(--border-light)] hover:border-[var(--border-focus)] transition-all shadow-sm group-hover:shadow-md">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <Folder size={24} />
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {project.status.toUpperCase()}
                    </span>
                </div>

                <h3 className="text-lg font-semibold text-[var(--text-main)] mb-1 group-hover:text-[hsl(var(--hue-primary),60%,50%)] transition-colors">
                    {project.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">{project.code}</p>

                <div className="space-y-2 text-sm text-[var(--text-muted)]">
                    <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>Leader: {project.leaderId}</span> {/* TODO: Resolve user name */}
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Start: {project.startDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign size={16} />
                        <span>Budget: {project.budgetFees.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
