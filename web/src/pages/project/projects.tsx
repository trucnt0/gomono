import classNames from 'classnames'
import httpClient from '../../utils/http-client'
import Page from '../../components/page'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { LeadModel, ProjectModel } from '../../models'
import { useEffect, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { Editor } from 'primereact/editor'
import { Dropdown } from 'primereact/dropdown'
import { Message } from 'primereact/message'
import { useFormik } from 'formik'
import * as yup from 'yup'

const projectSchema = yup.object({
    name: yup.string().required(),
    description: yup.string().nullable(),
    leadID: yup.string().required(),
})

function Projects() {
    const [projects, setProjects] = useState<ProjectModel[]>([])
    const [leads, setLeads] = useState<LeadModel[]>([])
    const [showPopup, setShowPopup] = useState(false)

    const formik = useFormik({
        initialValues: {
            id: '',
            name: '',
            description: '',
            isActive: false,
            leadID: ''
        },
        validationSchema: projectSchema,
        onSubmit: async (values) => {
            if (!!values.id) {
                await httpClient.put(`api/projects/${values.id}`, values)
            }
            else {
                await httpClient.post('api/projects', values)
            }
            await loadProjects()
            formik.resetForm()
            setShowPopup(false)
        },
    })

    useEffect(() => {
        loadProjects()
        loadLeads()
    }, [])

    const loadProjects = async () => {
        const projects = await httpClient.get('api/projects')
        setProjects(projects)
    }

    const loadLeads = async () => {
        const leads = await httpClient.get('api/leads')
        setLeads(leads)
    }

    const handleEdit = (p: ProjectModel) => {
        console.log(p)
        setShowPopup(true)
        formik.setFieldValue('id', p.id)
        formik.setFieldValue("name", p.name)
        formik.setFieldValue("description", p.description)
        formik.setFieldValue("isActive", p.isActive)
        formik.setFieldValue("leadID", p.leadID)
    }

    const leadTemplate = (p: ProjectModel) => (
        <span>{p.lead?.firstName} {p.lead?.lastName}</span>
    )

    const statusTemplate = (p: ProjectModel) => (
        <IoCheckmarkCircle size={30} className={classNames(p.isActive ? 'text-green-500' : 'text-yellow-500')} />
    )

    const editTemplate = (p: ProjectModel) => {
        return (<Button onClick={() => handleEdit(p)} icon='pi pi-pencil' severity="secondary" className='p-button-outlined'></Button>)
    }

    const commands = (
        <div className='flex gap-2'>
            <Button onClick={() => setShowPopup(true)} icon='pi pi-plus' label='Create'></Button>
            <Button disabled severity='success' onClick={() => setShowPopup(true)} icon='pi pi-send' label='Export'></Button>
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
                    <Column sortable filter field="createdDate" header="Created Date"></Column>
                    <Column sortable filter field="updatedDate" header="Updated Date"></Column>
                    <Column style={{ width: 80, textAlign: "center" }} body={editTemplate}></Column>
                </DataTable>
            </div>

            <Dialog header="Project Details" visible={showPopup} style={{ width: '30vw' }} onHide={() => setShowPopup(false)}>
                <form onSubmit={formik.handleSubmit}>
                    <label htmlFor="name" className="block text-900 font-medium mb-2">Project Name</label>
                    <InputText onChange={formik.handleChange} value={formik.values.name} id="name" type="text" placeholder="Project Name" className="w-full mb-3" />
                    {formik.errors.name && <Message severity="error" text="Project name is required" />}

                    <label htmlFor="lead" className="block text-900 font-medium mb-2">Lead</label>
                    <Dropdown
                        onChange={(e) => {
                            formik.setFieldValue('leadID', e.target.value)
                        }}
                        value={formik.values.leadID} options={leads} optionLabel="name" optionValue='leadID' placeholder="Select Lead" className="w-full mb-3" />
                    {formik.errors.leadID && <Message severity="error" text="Lead is required" />}


                    <label htmlFor="description" className="block text-900 font-medium mb-2">Description</label>
                    <Editor
                        id='description'
                        value={formik.values.description}
                        style={{ height: '320px' }}
                        className='mb-3'
                        onTextChange={(e) => {
                            formik.setFieldValue('description', e.textValue)
                        }}
                    />

                    <div className="flex align-items-center mb-6">
                        <div className="flex align-items-center">
                            <Checkbox onChange={formik.handleChange} checked={formik.values.isActive} id="isActive" className="mr-2" />
                            <label htmlFor="isActive">Active ?</label>
                        </div>
                    </div>
                    <div className='flex justify-content-end'>
                        <Button type="submit" label="Submit" icon="pi pi-save" severity='success' />
                    </div>
                </form>
            </Dialog>

        </Page>
    )
}

export default Projects