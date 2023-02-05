import React, { FC, useEffect, useState } from 'react'
import { FiUserPlus } from 'react-icons/fi'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import httpClient from '../utils/HttpClient'

const Register: FC = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [from, setFrom] = useState<any>()

    useEffect(() => {
        const from = searchParams.get('from')
        console.log(from)
        setFrom(from)
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const fd = new FormData(e.currentTarget)
        const username = fd.get('username')
        const password = fd.get('password')
        const firstName = fd.get('firstName')
        const lastName = fd.get('lastName')
        const email = fd.get('email')

        await httpClient.post('api/register', {
            firstName,
            lastName,
            username,
            password,
            email
        })

        toast.success('Account created successfully.')
        navigate(!!from ? '/' : "/login")
    }

    return (
        <div className="flex text-center justify-center h-screen py-52 bg-no-repeat bg-cover bg-center bg-fixed">
            <div>
                <div className='p-10 flex items-center flex-col bg-white rounded border shadow-xl'>
                    <h3 className='text-5xl mb-10'>Create an account</h3>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-4/5'>
                        <input required autoComplete='off' placeholder='First Name' className='f-input' type="text" name="firstName" id="firstName" />
                        <input required autoComplete='off' placeholder='Last Name' className='f-input' type="text" name="lastName" id="lastName" />
                        {!from && (
                            <>
                                <input autoComplete='off' placeholder='Username' className='f-input' type="text" name="username" id="username" />
                                <input autoComplete='off' placeholder='Email' className='f-input' type="text" name="email" id="email" />
                                <input autoComplete='off' placeholder='Password' className='f-input' type="password" name="password" id="password" />
                            </>
                        )}
                        <button className='f-btn'><FiUserPlus /> Submit</button>
                        <Link to='/login'>Already have an account ?</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register