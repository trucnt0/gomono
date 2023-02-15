import { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Breadcrumb = {
    label: string
    path: string
}

type Props = {
    breadcrumbs?: Breadcrumb[],
    caption: string,
    icon: ReactNode,
    children: ReactNode
}

const Page: FC<Props> = ({ breadcrumbs, icon, caption, children }) => {
    return (
        <div className='flex flex-col w-full h-full bg-white p-5 rounded'>
            <div className='flex font-bold justify-between items-center py-2 border-b'>
                {breadcrumbs && (
                    <div className='flex items-center gap-2'>
                        {breadcrumbs.map((b, i) => <Link key={i} to={b.path}>{b.label}</Link>)}
                    </div>
                )}
                <span className='text-xl flex items-center gap-3'>{icon} {caption}</span>
            </div>
            <div className='bg-white mt-3'>
                {children}
            </div>
        </div>
    )
}

export default Page