import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { LeadModel, ProjectModel } from 'src/models'
import httpClient from '../../utils/http-client'
import { useEffect, useState } from 'react'
import { Card } from 'primereact/card'
import { FiCheck, FiX } from 'react-icons/fi'

function Projects() {
    const [projects, setProjects] = useState<ProjectModel[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadProjects()
    }, [])

    async function loadProjects() {
        setLoading(true)
        const projects = await httpClient.get('api/projects')
        setLoading(false)
        setProjects(projects)
    }

    const leadTemplate = (p: ProjectModel) => (
        <span>{p.lead?.firstName} {p.lead?.lastName}</span>
    )

    const statusTemplate = (p: ProjectModel) => (
        <>
            {p.isActive && <FiCheck size={20} />}
            {!p.isActive && <FiX size={20} />}
        </>
    )

    return (
        <div className='p-3'>
            <Card title="Projects Management" subTitle="Manage your active projects and tracking the release progress">
                <DataTable loading={loading} stripedRows selectionMode="single" paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} showGridlines value={projects} tableStyle={{ minWidth: '50rem' }}>
                    <Column sortable field="name" header="Name"></Column>
                    <Column sortable field="description" header="Description"></Column>
                    <Column sortable field="lead" header="Lead" body={leadTemplate}></Column>
                    <Column sortable field="isActive" header="Status" body={statusTemplate}></Column>
                </DataTable>
            </Card>
        </div>
    )
}

export default Projects