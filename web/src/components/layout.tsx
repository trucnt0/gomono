import 'react-toastify/dist/ReactToastify.css'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ReactNode, createContext, useEffect, useRef } from 'react'
import { TOKEN, useAuth } from '../pages/auth-provider'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { Message } from 'primereact/message'
import { Toast } from 'primereact/toast'
import LocalStorageHelper from '../utils/localstorage-helper'
import { IoPieChart, IoPower } from 'react-icons/io5'

// const LayoutContext = createContext<{
//     showSuccess: (message: string) => void
//     showError: (error: string) => void
// }>()

const menus: MenuItem[] = [
    {
        label: 'Dashboard',
        path: '/',
        icon: <IoPieChart />
    },
    {
        label: 'Projects',
        path: '/projects',
        icon: <IoPower />
    }
]

interface MenuItem {
    label: string
    path: string
    icon: ReactNode
    items?: MenuItem[]
}

export default () => {
    const toast = useRef<any>(null)
    const { user, refreshUser } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        refreshUser()
    }, [])

    function logout() {
        LocalStorageHelper.remove(TOKEN)
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
                        <Message severity="warn" text="Welcome to GOMONO! Searchbar comming soon..." />
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
        </div>
    )
}