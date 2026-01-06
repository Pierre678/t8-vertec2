import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDatabase } from '../../lib/store';
import { ArrowLeft, CheckCircle, Circle, Clock, DollarSign } from 'lucide-react';

export function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const { projects, phases } = useDatabase();
    const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'budget'>('overview');

    const project = projects.find(p => p.id === id);
    const projectPhases = phases.filter(ph => ph.projectId === id);

    if (!project) {
        return <div className="p-8 text-center text-[var(--text-muted)]">Project not found</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <Link to="/projects" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] mb-4 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Projects
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-main)] flex items-center gap-3">
                            {project.title}
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {project.status.toUpperCase()}
                            </span>
                        </h1>
                        <p className="text-[var(--text-muted)] mt-1">{project.code}</p>
                    </div>
                    <button className="bg-[hsl(var(--hue-primary),60%,50%)] text-white px-4 py-2 rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity">
                        Edit Project
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-[var(--border-light)] mb-6">
                <div className="flex gap-6">
                    {['overview', 'phases', 'budget'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-3 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab
                                ? 'border-[hsl(var(--hue-primary),60%,50%)] text-[hsl(var(--hue-primary),60%,50%)]'
                                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-[var(--radius-md)] border border-[var(--border-light)] p-6 shadow-sm">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase mb-4">Details</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
                                    <span className="text-[var(--text-muted)]">Type</span>
                                    <span className="font-medium capitalize">{project.type.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
                                    <span className="text-[var(--text-muted)]">Start Date</span>
                                    <span className="font-medium">{project.startDate}</span>
                                </div>
                                {project.endDate && (
                                    <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
                                        <span className="text-[var(--text-muted)]">End Date</span>
                                        <span className="font-medium">{project.endDate}</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
                                    <span className="text-[var(--text-muted)]">Leader</span>
                                    <span className="font-medium">{project.leaderId}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase mb-4">Quick Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-[var(--bg-app)] rounded-[var(--radius-sm)]">
                                    <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1">
                                        <Clock size={16} />
                                        <span className="text-xs">Phases</span>
                                    </div>
                                    <p className="text-xl font-bold">{projectPhases.length}</p>
                                </div>
                                <div className="p-4 bg-[var(--bg-app)] rounded-[var(--radius-sm)]">
                                    <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1">
                                        <DollarSign size={16} />
                                        <span className="text-xs">Budget</span>
                                    </div>
                                    <p className="text-xl font-bold">{project.budgetFees.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'phases' && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Project Phases</h3>
                            <button className="text-sm text-[hsl(var(--hue-primary),60%,50%)] hover:underline">+ Add Phase</button>
                        </div>
                        <div className="space-y-2">
                            {projectPhases.map(phase => (
                                <div key={phase.id} className="flex items-center justify-between p-3 bg-[var(--bg-app)] rounded-[var(--radius-sm)] border border-[var(--border-light)]">
                                    <div className="flex items-center gap-3">
                                        {phase.status === 'done'
                                            ? <CheckCircle size={18} className="text-[hsl(var(--hue-success),60%,40%)]" />
                                            : <Circle size={18} className="text-[var(--text-muted)]" />
                                        }
                                        <div>
                                            <span className="font-medium">{phase.code}</span>
                                            <span className="mx-2 text-[var(--text-muted)]">-</span>
                                            <span>{phase.description}</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium">{phase.budgetFees ? `CHF ${phase.budgetFees.toLocaleString()}` : '-'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'budget' && (
                    <div className="text-center py-12 text-[var(--text-muted)]">
                        Budget Visualization Component Coming Soon
                    </div>
                )}
            </div>
        </div>
    );
}
