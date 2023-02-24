import { Card } from 'primereact/card'
import { FC, ReactNode } from 'react'
import { Toolbar } from 'primereact/toolbar'

type Props = {
    title: string,
    subTitle: string,
    commands?: ReactNode,
    children: ReactNode
}

const Page: FC<Props> = ({ title, subTitle, children, commands }) => {
    return (
        <div className='p-3'>
            <Card title={title} subTitle={subTitle}>
                <div className='flex flex-column gap-3'>
                    {commands && <Toolbar start={commands} />}
                    {children}
                </div>
            </Card>
        </div>
    )
}

export default Page