import { useState, createContext, useContext, ReactNode } from 'react';
import { User, Project, Phase, ServiceEntry, ServiceType, Opportunity, Invoice, InvoiceStatus, Allocation } from '../types';

// Mock Initial Data
const INITIAL_USERS: User[] = [
    { id: 'u1', name: 'Anna Smith', email: 'anna@example.com', role: 'project_manager', hourlyRate: 150 },
    { id: 'u2', name: 'Bob Jones', email: 'bob@example.com', role: 'employee', hourlyRate: 100 },
];

const INITIAL_PROJECTS: Project[] = [
    {
        id: 'p1', code: 'P-2024-001', title: 'Website Relaunch', clientId: 'c1', leaderId: 'u1',
        type: 'fixed_price', status: 'active', startDate: '2024-01-01', budgetFees: 50000, budgetExpenses: 5000
    }
];

const INITIAL_PHASES: Phase[] = [
    { id: 'ph1', projectId: 'p1', code: '10', description: 'Concept', status: 'done', budgetFees: 10000 },
    { id: 'ph2', projectId: 'p1', code: '20', description: 'Development', status: 'active', budgetFees: 30000 },
];

const SERVICE_TYPES: ServiceType[] = [
    { id: 'st1', name: 'Consulting', standardRate: 150 },
    { id: 'st2', name: 'Development', standardRate: 120 },
];

const INITIAL_INVOICES: Invoice[] = [
    {
        id: 'inv1', number: 'INV-2024-001', projectId: 'p1', date: '2024-01-20', dueDate: '2024-02-19',
        totalAmount: 12500, status: 'paid', items: []
    },
    {
        id: 'inv2', number: 'INV-2024-002', projectId: 'p1', date: '2024-02-20', dueDate: '2024-03-21',
        totalAmount: 8400, status: 'open', items: []
    }
];

const INITIAL_ALLOCATIONS: Allocation[] = [
    { id: 'al1', userId: 'u1', projectId: 'p1', startDate: '2024-01-01', endDate: '2024-03-31', percentage: 50 },
    { id: 'al2', userId: 'u2', projectId: 'p1', startDate: '2024-02-01', endDate: '2024-02-28', percentage: 100 }
];

const INITIAL_OPPORTUNITIES: Opportunity[] = [
    { id: 'opp1', title: 'New CRM Implementation', clientId: 'c2', ownerId: 'u1', stage: 'offer', probability: 60, expectedVolume: 25000, closeDate: '2024-03-01' },
    { id: 'opp2', title: 'Data Migration Audit', clientId: 'c3', ownerId: 'u2', stage: 'lead', probability: 20, expectedVolume: 5000, closeDate: '2024-04-15' },
    { id: 'opp3', title: 'Mobile App Concept', clientId: 'c1', ownerId: 'u1', stage: 'won', probability: 100, expectedVolume: 12000, closeDate: '2024-02-10' }
];

export interface DatabaseContextType {
    users: User[];
    projects: Project[];
    phases: Phase[];
    serviceTypes: ServiceType[];
    serviceEntries: ServiceEntry[];
    opportunities: Opportunity[];
    invoices: Invoice[];
    allocations: Allocation[];

    // Actions
    addServiceEntry: (entry: ServiceEntry) => void;
    addProject: (project: Project) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    addInvoice: (invoice: Invoice) => void;
    updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
    addAllocation: (allocation: Allocation) => void;
    addOpportunity: (opportunity: Opportunity) => void;
    updateOpportunityStage: (id: string, stage: Opportunity['stage']) => void;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export function DatabaseProvider({ children }: { children: ReactNode }) {
    const [users] = useState<User[]>(INITIAL_USERS);
    const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
    const [phases] = useState<Phase[]>(INITIAL_PHASES);
    const [serviceTypes] = useState<ServiceType[]>(SERVICE_TYPES);
    const [serviceEntries, setServiceEntries] = useState<ServiceEntry[]>([]);
    const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
    const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
    const [allocations, setAllocations] = useState<Allocation[]>(INITIAL_ALLOCATIONS);

    const addServiceEntry = (entry: ServiceEntry) => {
        setServiceEntries(prev => [...prev, entry]);
    };

    const addProject = (project: Project) => {
        setProjects(prev => [...prev, project]);
    };

    const updateProject = (id: string, updates: Partial<Project>) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const addInvoice = (invoice: Invoice) => {
        setInvoices(prev => [...prev, invoice]);
    };

    const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
        setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
    };

    const addAllocation = (allocation: Allocation) => {
        setAllocations(prev => [...prev, allocation]);
    };

    const addOpportunity = (opportunity: Opportunity) => {
        setOpportunities(prev => [...prev, opportunity]);
    };

    const updateOpportunityStage = (id: string, stage: Opportunity['stage']) => {
        setOpportunities(prev => prev.map(opp => opp.id === id ? { ...opp, stage } : opp));
    };

    return (
        <DatabaseContext.Provider value={{
            users, projects, phases, serviceTypes, serviceEntries, opportunities, invoices, allocations,
            addServiceEntry, addProject, updateProject, addInvoice, updateInvoiceStatus, addAllocation,
            addOpportunity, updateOpportunityStage
        }}>
            {children}
        </DatabaseContext.Provider>
    );
}

export function useDatabase() {
    const context = useContext(DatabaseContext);
    if (!context) throw new Error("useDatabase must be used within DatabaseProvider");
    return context;
}
