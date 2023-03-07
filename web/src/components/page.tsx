import { Card } from 'primereact/card'
import { FC, ReactNode } from 'react'
import { Toolbar } from 'primereact/toolbar'

type Props = {
    icon?: ReactNode,
    title: string,
    subTitle: string,
    commands?: ReactNode,
    children: ReactNode
}

const Page: FC<Props> = ({ icon, title, subTitle, children, commands }) => {

    const cardTitle = (
        <div className='flex align-items-center gap-1'>
            {icon && icon}
            <span>{title}</span>
        </div>
    )

    return (
        <div className='p-3'>
            <Card title={cardTitle} subTitle={subTitle}>
                <div className='flex flex-column gap-3'>
                    {commands}
                    {children}
                </div>
            </Card>
        </div>
    )
}

export default Page