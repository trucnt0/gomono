import 'react-toastify/dist/ReactToastify.css'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiHome, FiSettings, FiSlack, FiSunrise, FiUser } from 'react-icons/fi'
import { FC, ReactNode, useEffect } from 'react'
import { TOKEN, useAuth } from '../pages/auth-provider'
import { Button } from 'primereact/button'
import LocalStorageHelper from '../utils/localstorage-helper'

const navs: MenuItem[] = [
    {
        label: 'Home',
        path: '/',
        icon: <FiHome />
    },
    // {
    //     label: 'Projects',
    //     path: '/projects',
    //     icon: <FiSunrise />
    // },
    // {
    //     label: 'Settings',
    //     path: '/settings',
    //     icon: <FiSettings />
    // },
    // {
    //     label: 'FAQ',
    //     path: '/faq',
    //     icon: <FiSlack />,
    //     items: [
    //         {
    //             label: 'Contribute',
    //             path: 'contribute',
    //             icon: <FiArrowRight />
    //         },
    //         {
    //             label: 'License',
    //             path: 'license',
    //             icon: <FiArrowRight />
    //         },
    //     ]
    // },
]

interface MenuItem {
    label: string
    path: string
    icon: ReactNode
    items?: MenuItem[]
}

export default () => {

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
            <nav className='sidebar bg-primary'>
                <div className="brand">GOMONO</div>
                <ul className='nav'>
                    {navs.map((n, i) => {
                        return (
                            <Link className='nav-item' to={n.path}>
                                {n.icon} <span>{n.label}</span>
                            </Link>
                        )
                    })}
                </ul>
                <div className='footer'>
                    {!!user && <Button onClick={logout} label='Logout' className='w-full'></Button>}
                </div>
            </nav>
            <div className='right-content'>
                <nav className="topbar">
                    <div></div>
                    <div className='profile'>
                        <span>Hi {user?.name}</span>
                    </div>
                </nav>
                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}