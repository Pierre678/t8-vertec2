// Core Data Types

// --- Users ---
export type UserRole = 'admin' | 'project_manager' | 'employee';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
    hourlyRate: number;
}

// --- Projects ---
export type ProjectType = 'fixed_price' | 'time_material';
export type ProjectStatus = 'active' | 'inactive' | 'archived';

export interface Project {
    id: string;
    code: string;
    title: string;
    description?: string;
    clientId: string;
    leaderId: string;
    type: ProjectType;
    status: ProjectStatus;
    startDate: string; // ISO
    endDate?: string;
    budgetFees: number;
    budgetExpenses: number;
}

export interface Phase {
    id: string;
    projectId: string;
    code: string;
    description: string;
    status: 'active' | 'done';
    budgetFees?: number;
}

// --- Services & Expenses ---
export interface ServiceType {
    id: string;
    name: string;
    standardRate: number;
}

export interface ServiceEntry {
    id: string;
    projectId: string;
    phaseId: string;
    userId: string;
    serviceTypeId: string;
    date: string; // ISO
    minutes: number;
    description: string;
    billed: boolean;
    invoiceId?: string;
}

export interface ExpenseType {
    id: string;
    name: string;
}

export interface ExpenseEntry {
    id: string;
    projectId: string;
    phaseId: string;
    userId: string;
    expenseTypeId: string;
    date: string;
    amount: number;
    currency: string;
    description: string;
    billed: boolean;
    invoiceId?: string;
}

// --- Sales (CRM) ---
export type OpportunityStage = 'lead' | 'contact' | 'offer' | 'won' | 'lost';

export interface Opportunity {
    id: string;
    title: string;
    clientId: string;
    ownerId: string;
    stage: OpportunityStage;
    probability: number;
    expectedVolume: number;
    closeDate: string;
}

// --- Resource Planning ---
export interface Allocation {
    id: string;
    userId: string;
    projectId: string;
    phaseId?: string;
    startDate: string;
    endDate: string;
    percentage: number;
}

// --- Invoicing ---
export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'cancelled';

export interface Invoice {
    id: string;
    number: string;
    projectId: string;
    date: string;
    dueDate: string;
    totalAmount: number;
    status: InvoiceStatus;
    items: InvoiceItem[];
}

export interface InvoiceItem {
    id: string;
    description: string;
    amount: number;
}
