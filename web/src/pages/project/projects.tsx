import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ProjectModel } from 'src/models'
import { useEffect, useState } from 'react'
import { Card } from 'primereact/card'
import { Dialog } from 'primereact/dialog'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { Button } from 'primereact/button'
import classNames from 'classnames'
import httpClient from '../../utils/http-client'
import Page from '../../components/page'
import { InputText } from 'primereact/inputtext'

function Projects() {
    const [projects, setProjects] = useState<ProjectModel[]>([])
    const [showPopup, setShowPopup] = useState(false)

    useEffect(() => {
        loadProjects()
    }, [])

    async function loadProjects() {
        const projects = await httpClient.get('api/projects')
        setProjects(projects)
    }

    const leadTemplate = (p: ProjectModel) => (
        <span>{p.lead?.firstName} {p.lead?.lastName}</span>
    )

    const statusTemplate = (p: ProjectModel) => (
        <IoCheckmarkCircle size={30} className={classNames(p.isActive ? 'text-green-500' : 'text-yellow-500')} />
    )

    const commands = (
        <div className='flex gap-2'>
            <Button onClick={() => setShowPopup(true)} icon='pi pi-plus' label='Create'></Button>
            <Button severity='success' onClick={() => setShowPopup(true)} icon='pi pi-send' label='Export'></Button>
        </div>
    )

    return (
        <Page
            title="Projects Management"
            subTitle="Manage your active projects and tracking the release progress"
            commands={commands}
        >
            <div className="flex flex-column gap-3">
                <DataTable
                    paginator
                    stripedRows
                    showGridlines
                    rows={10}
                    value={projects}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    tableStyle={{ minWidth: '50rem' }}
                >
                    <Column sortable filter field="name" header="Name"></Column>
                    <Column sortable filter field="description" header="Description"></Column>
                    <Column sortable filter field="lead" header="Lead" body={leadTemplate}></Column>
                    <Column sortable filter field="isActive" header="Status" body={statusTemplate} style={{ width: 80, textAlign: "center" }}></Column>
                </DataTable>
            </div>

            <Dialog header="Project Detail" visible={showPopup} style={{ width: '600px' }} onHide={() => setShowPopup(false)}>
                <InputText className='w-full'></InputText>
            </Dialog>

        </Page>
    )
}

export default Projects