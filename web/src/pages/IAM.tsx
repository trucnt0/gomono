import { FC, useEffect, useState } from 'react'
import DataGrid, { ColumnDef } from '../components/DataGrid'
import { FiEdit2, FiTrash2, FiUserPlus } from 'react-icons/fi'
import Modal from '../components/Modal'
import httpClient from '../utils/HttpClient'
import { UserModel } from '../models'
import { toast } from 'react-toastify'

const IAM: FC = () => {
    const [users, setUsers] = useState<UserModel[]>([])
    const [newUser, setNewUser] = useState<any>()
    const [isOpen, setOpen] = useState(false)

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        const users = await httpClient.get<UserModel[]>('api/users')
        setUsers(users)
    }

    const columns: ColumnDef[] = [
        {
            label: 'First Name',
            field: 'FirstName'
        },
        {
            label: 'Last Name',
            field: 'LastName'
        },
        {
            label: 'Email',
            field: 'Email'
        },
        {
            label: 'Status',
            field: 'IsActive',
        },
        {
            field: 'ID',
            render: (id: any) => {
                return (
                    <div className='flex items-center gap-2 justify-end'>
                        <button className='f-btn'><FiEdit2 /></button>
                        <button onClick={e => deleteUser(id)} className='f-btn'><FiTrash2 /></button>
                    </div>
                )
            }
        },
    ]

    const closePopup = (e: any) => setOpen(false)

    const handleChange = (e: any) => setNewUser({ ...newUser, [e.target.name]: e.target.value })

    const createUser = (e: any) => {

    }

    const deleteUser = async (id: any) => {
        if (confirm('Are you sure you want to delete ?')) {
            await httpClient.delete(`api/users/${id}`)
            await loadUsers()
            toast.success('User Deleted')
        }
    }

    return (
        <div className='flex flex-col gap-5 items-center'>
            <div className='flex gap-2 lg:w-2/3'>
                <button className='f-btn f-primary' onClick={() => setOpen(true)}><FiUserPlus /> New User</button>
            </div>

            <div className='flex justify-center lg:w-2/3'>
                <DataGrid columns={columns} datasource={users} />
            </div>

            <Modal title='New User' isOpen={isOpen} onClose={closePopup} onSubmit={createUser} >
                <input name='name' onChange={handleChange} type="text" className='f-input' placeholder='Project Name' />
                <textarea name='description' onChange={handleChange} rows={10} className='f-input' placeholder='Description' />
            </Modal>
        </div>
    )
}

export default IAM