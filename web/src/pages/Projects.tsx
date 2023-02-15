import { FiCheckCircle, FiEdit2, FiExternalLink, FiFilePlus, FiLock, FiSend, FiShare, FiTrash2, FiXCircle } from 'react-icons/fi'
import DataGrid, { ColumnDef } from '../components/DataGrid'
import { FC, useEffect, useMemo, useState } from 'react'
import Modal from '../components/Modal'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import http from '../utils/HttpClient'
import { LeadModel, ProjectModel } from '../models'
import Dropdown from '../components/Dropdown'
import Page from '../components/Page'
import { IoHome } from 'react-icons/io5'

const Projects: FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [projects, setProjects] = useState<ProjectModel[]>([])
    const [leads, setLeads] = useState<LeadModel[]>([])
    const [newProject, setNewProject] = useState<ProjectModel>()
    const columns: ColumnDef[] = [
        { field: 'name', label: 'Name' },
        { field: 'description', label: 'Description' },
        {
            field: 'lead',
            label: 'Project Lead',
            render: (lead: any) => {
                return (
                    <span>{lead.firstName} {lead.lastName}</span>
                )
            }
        },
        {
            field: 'isActive',
            label: 'Status',
            render: (isActive: boolean) => {
                return (
                    <span>{isActive ? <FiCheckCircle className='text-emerald-500 text-lg' /> : <FiXCircle className='text-red-500 text-lg' />}</span>
                )
            }
        },
        {
            field: 'id',
            render: (id: string) => {
                return (
                    <div className='flex items-center gap-2 justify-end'>
                        <button className='f-btn'><FiEdit2 /></button>
                        <button className='f-btn'><FiTrash2 /></button>
                    </div>
                )
            }
        },
    ]

    useEffect(() => {
        loadProjects()
    }, [])

    async function loadProjects() {
        const projects = await http.get('api/projects')
        setProjects(projects)
    }

    async function loadLeads() {
        const leads = await http.get('api/leads')
        setLeads(leads)
    }

    async function createProject() {
        await http.post('api/projects', newProject)
        toast.success('Project created')
        await loadProjects()
        closePopup()
    }

    function closePopup() {
        setIsOpen(false)
    }

    function handleChange(e: any) {
        setNewProject({
            ...newProject,
            [e.target.name]: e.target.value,
        })
    }

    function onPopupOpened() {
        loadLeads()
        console.log('Project popup opened....')
    }

    return (
        <Page icon={<IoHome />} caption='Project Management'>
            <div className='flex flex-col gap-5 w-full'>
                <div className='flex gap-2'>
                    <button className='f-btn f-primary' onClick={() => setIsOpen(true)}><FiFilePlus /> New Project</button>
                    <Link to='/iam' className='f-btn f-warning'><FiSend /> Create Lead</Link>
                </div>

                <div className='flex justify-center'>
                    <DataGrid columns={columns} datasource={projects} />
                </div>

                <Modal title='New Project' isOpen={isOpen} onOpen={onPopupOpened} onClose={closePopup} onSubmit={createProject} >
                    <input name='name' onChange={handleChange} type="text" className='f-input' placeholder='Project Name' />
                    <textarea name='description' onChange={handleChange} rows={10} className='f-input' placeholder='Description' />
                    <Dropdown name='leadID' onChange={handleChange} datasource={leads} displayMember='name' valueMember='leadID' />
                </Modal>
            </div>
        </Page>
    )
}
export default Projects