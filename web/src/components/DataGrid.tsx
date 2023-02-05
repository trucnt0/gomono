import { FC } from 'react'
import cn from 'classnames'

export interface ColumnDef {
    field: string
    label?: string
    render?: (value: any) => void
}

interface Props {
    width?: string,
    columns: ColumnDef[]
    datasource: any[]
}

const DataGrid: FC<Props> = ({
    width,
    columns,
    datasource
}) => {
    return (
        <table className={cn('table-auto border bg-white', !!width ? `w-[${width}]` : 'w-full')}>
            <thead>
                <tr className='border-b bg-slate-100'>
                    {columns.map((col, idx) => {
                        return (
                            <th className='text-left px-5 py-2 text-slate-600'
                                key={idx}
                            >
                                {col.label}
                            </th>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                {datasource.map((data, i) => {
                    return (
                        <tr key={i} className='transition-all even:bg-slate-50 hover:bg-slate-200'>
                            {columns.map((col, j) => {
                                return (
                                    <td className='px-5 py-2 text-slate-500'
                                        key={j}>
                                        {!!col.render
                                            ? col.render(data[col.field])
                                            : data[col.field]
                                        }
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table >
    )
}

export default DataGrid