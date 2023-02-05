import { FiCheckCircle, FiEdit2, FiExternalLink, FiFilePlus, FiLock, FiSend, FiShare, FiTrash2, FiXCircle } from 'react-icons/fi'
import DataGrid, { ColumnDef } from '../components/DataGrid'
import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import axios from 'axios'
import { buildURL } from '../utils'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

interface UserModel {
    FirstName: string
    LastName: string
    ID: string
}

interface ProjectModel {
    ID?: string
    Name?: string
    Description?: string
    LeadID?: string
    LeadName?: string
    IsActive?: boolean
    Lead?: UserModel
}

interface LeadModel {
    FirstName: string
    LastName: string
    ID?: string
}

const Projects = () => {
    const [isProjectOpen, setProjectOpen] = useState(false)
    const [projects, setProjects] = useState<ProjectModel[]>([])
    const [leads, setLeads] = useState<LeadModel[]>([])
    const [newProject, setNewProject] = useState<ProjectModel>()
    const columns: ColumnDef[] = [
        { field: 'ID', label: '#ID' },
        { field: 'Name', label: 'Name' },
        { field: 'Description', label: 'Description' },
        {
            field: 'Lead',
            label: 'Project Lead',
            render: (lead: any) => {
                return (
                    <span>{lead.FirstName} {lead.LastName}</span>
                )
            }
        },
        {
            field: 'IsActive',
            label: 'Status',
            render: (isActive: any) => {
                return (
                    <span>{isActive ? <FiCheckCircle className='text-emerald-500 text-lg' /> : <FiXCircle className='text-red-500 text-lg' />}</span>
                )
            }
        },
        {
            field: 'ID',
            render: (id: any) => {
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
        const res = await axios.get(buildURL('api/projects'), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setProjects(res.data)
    }

    async function loadLeads() {
        const res = await axios.get(buildURL('api/leads'), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setLeads(res.data)
    }

    async function createProject() {
        const res = await axios.post(buildURL('api/projects'), newProject, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        toast.success('Project created')
        await loadProjects()
        closeProjectPopup()
    }

    function closeProjectPopup() {
        setProjectOpen(false)
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
                <button className='f-btn f-primary' onClick={() => setProjectOpen(true)}><FiFilePlus /> New Project</button>
                <Link to='/register?from=projects' className='f-btn f-warning'><FiSend /> Create Lead</Link>
                <button className='f-btn'><FiShare /> Share</button>
                <button className='f-btn'><FiLock /> Lock</button>
                <button className='f-btn'><FiExternalLink /> Discussion</button>
            </div>

            <div className='flex justify-center lg:w-2/3'>
                <DataGrid columns={columns} datasource={projects} />
            </div>

            <Modal isOpen={isProjectOpen} onClose={closeProjectPopup} onSubmit={createProject} >
                <input name='name' onChange={handleChange} type="text" className='f-input' placeholder='Project Name' />
                <textarea name='description' onChange={handleChange} rows={10} className='f-input' placeholder='Description' />
                <select name='leadID' onChange={handleChange} className='f-input' id="leads">
                    {leads.map((p, i) => {
                        return (
                            <option value={p.ID} key={p.ID}>{p.FirstName} {p.LastName}</option>
                        )
                    })}
                </select>
            </Modal>
        </div>
    )
}

export default Projects
