import { Routes, Route } from 'react-router-dom'
import { DatabaseProvider } from './lib/store'
import { AppShell } from './components/layout/AppShell'
import { ProjectList } from './modules/projects/ProjectList'
import { ProjectDetail } from './modules/projects/ProjectDetail'
import { ProjectEditor } from './modules/projects/ProjectEditor'
import { ServicesOverview } from './modules/services/ServicesOverview'
import { InvoiceList } from './modules/invoices/InvoiceList'
import { InvoiceDetail } from './modules/invoices/InvoiceDetail'
import { InvoiceGenerator } from './modules/invoices/InvoiceGenerator'
import { ResourceView } from './modules/resources/ResourceView'
import { PipelineBoard } from './modules/sales/PipelineBoard'
import { ReportViewer } from './modules/bi/ReportViewer'

function Dashboard() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-main)]">Dashboard</h1>
                <p className="text-[var(--text-muted)]">Welcome back to Vertec Copycat.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-[var(--radius-md)] shadow-sm border border-[var(--border-light)]">
                    <h3 className="text-sm font-medium text-[var(--text-muted)] mb-2">Total Revenue</h3>
                    <p className="text-2xl font-bold">CHF 124,500</p>
                </div>
                <div className="p-6 bg-white rounded-[var(--radius-md)] shadow-sm border border-[var(--border-light)]">
                    <h3 className="text-sm font-medium text-[var(--text-muted)] mb-2">Active Projects</h3>
                    <p className="text-2xl font-bold">12</p>
                </div>
                <div className="p-6 bg-white rounded-[var(--radius-md)] shadow-sm border border-[var(--border-light)]">
                    <h3 className="text-sm font-medium text-[var(--text-muted)] mb-2">Billable Hours (This Week)</h3>
                    <p className="text-2xl font-bold">34.5h</p>
                </div>
            </div>
        </>
    )
}

function App() {
    return (
        <DatabaseProvider>
            <AppShell>
                <Routes>
                    <Route path="/" element={<Dashboard />} />

                    {/* Projects Module */}
                    <Route path="/projects" element={<ProjectList />} />
                    <Route path="/projects/new" element={<ProjectEditor />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route path="/projects/:id/edit" element={<ProjectEditor />} />

                    {/* Services Module */}
                    <Route path="/services" element={<ServicesOverview />} />

                    {/* Invoices Module */}
                    <Route path="/invoices" element={<InvoiceList />} />
                    <Route path="/invoices/new" element={<InvoiceGenerator />} />
                    <Route path="/invoices/:id" element={<InvoiceDetail />} />

                    {/* Resources Module */}
                    <Route path="/resources" element={<ResourceView />} />

                    {/* Sales Module */}
                    <Route path="/sales" element={<PipelineBoard />} />

                    {/* BI Module */}
                    <Route path="/reports" element={<ReportViewer />} />

                    <Route path="*" element={<div className="p-4">404 - Not Found</div>} />
                </Routes>
            </AppShell>
        </DatabaseProvider>
    )
}

export default App
