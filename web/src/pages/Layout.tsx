import 'react-toastify/dist/ReactToastify.css'
import { NavLink, Outlet } from 'react-router-dom'
import { FiBell, FiChevronDown } from 'react-icons/fi'
import { IoAccessibility, IoHome, IoPerson, IoPower } from 'react-icons/io5'
import { ToastContainer } from 'react-toastify'
import { FC, ReactNode, useEffect } from 'react'
import { useAuth } from "./AuthProvider"

type NavItemProps = {
    title: string,
    path: string,
    icon: ReactNode,
    items?: NavItemProps[]
}
const NavItem: FC<NavItemProps> = ({ title, path, icon }) => {
    return (
        <NavLink className="px-5 py-3 hover:bg-emerald-400 flex items-center gap-2" to={path}>{icon} {title}</NavLink>
    )
}

type SideNavProps = {}
const SideNavContainer: FC<SideNavProps> = ({ }) => {
    return (
        <nav className='w-[250px] flex flex-col border-r bg-emerald-500 text-white'>
            <div className='text-2xl text-left p-5'>Gomono</div>
            <nav className='flex flex-col'>
                <NavItem path='/' title='Projects' icon={<IoHome className='text-xl' />}></NavItem>
                <NavItem path='/users' title='Users' icon={<IoPerson className='text-xl' />}></NavItem>
                <NavItem path='/roles' title='Roles' icon={<IoAccessibility className='text-xl' />}></NavItem>
            </nav>
        </nav>
    )
}

type MainContainerProps = {}
const MainContainer: FC<MainContainerProps> = ({ }) => {
    const { user, refreshUser } = useAuth()

    useEffect(() => {
        refreshUser()
    }, [])

    return (
        <div className='flex-1'>
            <div className='p-5 h-16 flex gap-2 items-center border-b bg-white'>
                <div className='transition-all w-[250px] items-center'>
                    <input type="text" className='f-input' placeholder='Search...' />
                </div>
                <div className='flex flex-1 gap-5 items-center justify-end'>
                    <button>
                        <FiBell className='text-lg' />
                    </button>
                    <button className='flex items-center gap-1 p-3 rounded hover:bg-slate-100 hover:cursor-pointer'>
                        <span>{user?.name}</span>
                        <span><FiChevronDown /></span>
                    </button>
                </div>
            </div>
            <main className='px-5 py-5'>
                <Outlet />
            </main>
        </div>
    )
}

export default () => {
    return (
        <div className='flex w-screen h-screen bg-slate-100'>
            <ToastContainer />
            <SideNavContainer />
            <MainContainer />
        </div>
    )
}