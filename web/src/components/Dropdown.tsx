import { ComponentPropsWithRef, FC } from 'react'

interface DropdownProps extends ComponentPropsWithRef<"select"> {
    datasource: any[]
    displayMember?: string
    valueMember?: string
}

const Dropdown: FC<DropdownProps> = ({ datasource, displayMember, valueMember, ...rest }) => {

    const displayExpr = displayMember || 'text'
    const valueExpr = valueMember || 'value'
    const options = [{ [displayExpr]: 'Select an item', [valueExpr]: Number.MIN_SAFE_INTEGER }, ...datasource]

    return (
        <select className='f-input' {...rest}>
            {options.map((item, idx) => {
                return (
                    <option key={item[valueExpr]} value={item[valueExpr]}>{item[displayExpr]}</option>
                )
            })}
        </select>
    )
}

export default Dropdown