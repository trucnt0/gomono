import { FiCheckCircle, FiEdit2, FiExternalLink, FiFilePlus, FiLock, FiSend, FiShare, FiTrash2, FiXCircle } from 'react-icons/fi'
import DataGrid, { ColumnDef } from '../components/DataGrid'
import { FC, useEffect, useState } from 'react'
import Modal from '../components/Modal'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import http from '../utils/HttpClient'
import { LeadModel, ProjectModel } from '../models'

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
            render: (lead: LeadModel) => {
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
        (async () => {
            await loadProjects()
            await loadLeads()
        })()
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

    return (
        <div className='flex flex-col gap-5 items-center'>
            <div className='flex gap-2 lg:w-2/3'>
                <button className='f-btn f-primary' onClick={() => setIsOpen(true)}><FiFilePlus /> New Project</button>
                <Link to='/iam' className='f-btn f-warning'><FiSend /> Create Lead</Link>
                <button className='f-btn'><FiShare /> Share</button>
                <button className='f-btn'><FiLock /> Lock</button>
                <button className='f-btn'><FiExternalLink /> Discussion</button>
            </div>

            <div className='flex justify-center lg:w-2/3'>
                <DataGrid columns={columns} datasource={projects} />
            </div>

            <Modal title='New Project' isOpen={isOpen} onClose={closePopup} onSubmit={createProject} >
                <input name='name' onChange={handleChange} type="text" className='f-input' placeholder='Project Name' />
                <textarea name='description' onChange={handleChange} rows={10} className='f-input' placeholder='Description' />
                <select name='leadID' onChange={handleChange} className='f-input' id="leads">
                    {leads.map((p, i) => {
                        return (
                            <option value={p.id} key={p.id}>{p.firstName} {p.lastName}</option>
                        )
                    })}
                </select>
            </Modal>
        </div>
    )
}
export default Projects