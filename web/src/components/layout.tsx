import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ReactNode, useCallback, useEffect, useInsertionEffect, useRef, useState } from 'react'
import { TOKEN, useAuth } from '../providers/authProvider'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { Toast } from 'primereact/toast'
import { IoApps, IoBarChart, IoSettings } from 'react-icons/io5'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { AutoComplete } from 'primereact/autocomplete'
import { ProjectModel } from '@/domain'
import projectService from '@/services/projectService'
import StorageHelper from '@/utils/storageHelper'

const menus: MenuItem[] = [
    {
        label: 'Dashboard',
        path: '/',
        icon: <IoBarChart size={22} />
    },
    {
        label: 'Projects',
        path: '/projects',
        icon: <IoApps size={22} />
    },
    {
        label: 'Setting',
        path: '/setting',
        icon: <IoSettings size={22} />
    },
]

interface MenuItem {
    label: string
    path: string
    icon: ReactNode
    items?: MenuItem[]
}

export default () => {
    const toast = useRef<any>(null)
    const [searchResult, setSearchResult] = useState<ProjectModel[]>([])
    const [searchText, setSearchText] = useState("")
    const [searchItem, setSearchItem] = useState<any>()
    const { user, refreshUser } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        refreshUser()
    }, [])

    async function handleSearch(e: any) {
        const query = e.query
        const result = await projectService.getProjects(query)
        setSearchResult(result)
    }

    function logout() {
        StorageHelper.remove(TOKEN)
        navigate('/login')
    }

    return (
        <div className='layout'>
            <nav className='sidebar'>
                <div className="brand">GOMONO</div>
                <ul className='nav'>
                    {menus.map((n, i) => {
                        return (
                            <NavLink key={i} className='nav-item' to={n.path}>
                                {n.icon} <span>{n.label}</span>
                            </NavLink>
                        )
                    })}
                </ul>
                <div className='footer'>
                    {!!user && <Button onClick={logout} label='Logout' className='w-full p-3 border-solid border-indigo-300'></Button>}
                </div>
            </nav>
            <div className='right-content'>
                <nav className="topbar">
                    <div>
                        <AutoComplete
                            field='name'
                            suggestions={searchResult}
                            completeMethod={handleSearch}
                            value={searchText}
                            onChange={e => setSearchText(e.value)}
                            onSelect={e => setSearchItem(e.value)}
                            inputStyle={{ width: 350 }}
                            placeholder='Search project...'
                        />
                    </div>
                    <div className='profile'>
                        <Avatar label={user?.name?.substring(0, 2)?.toUpperCase()} size='large' shape="circle" />
                    </div>
                </nav>
                <main className="content">
                    <Outlet />
                </main>
            </div>
            <Toast ref={toast} />
            <ConfirmDialog />
        </div>
    )
}