import { useDatabase } from '../../lib/store';
import { Opportunity, OpportunityStage } from '../../types';
import { Plus, GripVertical, DollarSign } from 'lucide-react';
import { useState } from 'react';

const STAGES: { id: OpportunityStage; label: string; color: string }[] = [
    { id: 'lead', label: 'Lead', color: 'bg-gray-100 border-gray-200 text-gray-700' },
    { id: 'contact', label: 'Contact', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { id: 'offer', label: 'Offer', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
    { id: 'won', label: 'Won', color: 'bg-green-50 border-green-200 text-green-700' },
    { id: 'lost', label: 'Lost', color: 'bg-red-50 border-red-200 text-red-700' },
];

export function PipelineBoard() {
    const { opportunities, updateOpportunityStage, addOpportunity } = useDatabase();
    const [draggedOpp, setDraggedOpp] = useState<string | null>(null);

    const handleDragStart = (id: string) => {
        setDraggedOpp(id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (stage: OpportunityStage) => {
        if (draggedOpp) {
            updateOpportunityStage(draggedOpp, stage);
            setDraggedOpp(null);
        }
    };

    const handleNewOpportunity = () => {
        // Quick add for prototype
        const newOpp: Opportunity = {
            id: `opp${Math.floor(Math.random() * 10000)}`,
            title: 'New Opportunity',
            clientId: 'c1',
            ownerId: 'u1',
            stage: 'lead',
            probability: 10,
            expectedVolume: 0,
            closeDate: new Date().toISOString().split('T')[0]
        };
        addOpportunity(newOpp);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-main)]">Sales Pipeline</h1>
                    <p className="text-[var(--text-muted)]">Manage your opportunities and deals.</p>
                </div>
                <button
                    onClick={handleNewOpportunity}
                    className="flex items-center gap-2 bg-[hsl(var(--hue-primary),60%,50%)] text-white px-4 py-2 rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
                >
                    <Plus size={18} />
                    <span>New Opportunity</span>
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-8">
                {STAGES.map(stage => {
                    const stageOpps = opportunities.filter(o => o.stage === stage.id);
                    const totalVolume = stageOpps.reduce((acc, curr) => acc + curr.expectedVolume, 0);

                    return (
                        <div
                            key={stage.id}
                            className="min-w-[280px] w-full max-w-xs flex-shrink-0"
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(stage.id)}
                        >
                            <div className={`p-3 rounded-t-[var(--radius-md)] border-t border-l border-r font-semibold flex justify-between items-center ${stage.color}`}>
                                <span>{stage.label}</span>
                                <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full">{stageOpps.length}</span>
                            </div>
                            <div className="bg-[var(--bg-app)] border-b border-l border-r border-[var(--border-light)] p-3 rounded-b-[var(--radius-md)] min-h-[500px]">
                                <div className="mb-3 text-xs font-medium text-[var(--text-muted)] text-right">
                                    Vol: CHF {totalVolume.toLocaleString()}
                                </div>

                                <div className="space-y-3">
                                    {stageOpps.map(opp => (
                                        <div
                                            key={opp.id}
                                            draggable
                                            onDragStart={() => handleDragStart(opp.id)}
                                            className="bg-white p-4 rounded-[var(--radius-sm)] border border-[var(--border-light)] shadow-sm hover:shadow-md transition-shadow cursor-move group"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="text-xs font-medium text-[var(--text-muted)]">#{opp.id}</span>
                                                <GripVertical size={14} className="text-gray-300 opacity-0 group-hover:opacity-100" />
                                            </div>
                                            <h4 className="font-medium text-[var(--text-main)] mb-1">{opp.title}</h4>
                                            <p className="text-xs text-[var(--text-muted)] mb-3">{opp.clientId}</p>

                                            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-light)]">
                                                <div className="flex items-center gap-1 text-sm font-medium">
                                                    <DollarSign size={14} className="text-[var(--text-muted)]" />
                                                    {opp.expectedVolume.toLocaleString()}
                                                </div>
                                                <div className={`text-xs font-bold ${opp.probability >= 80 ? 'text-green-600' :
                                                        opp.probability >= 50 ? 'text-yellow-600' : 'text-gray-500'
                                                    }`}>
                                                    {opp.probability}%
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
