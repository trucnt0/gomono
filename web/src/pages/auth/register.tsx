import React, { FC, useEffect, useState } from 'react'
import { FiUserPlus } from 'react-icons/fi'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import httpClient from '../../utils/http-client'

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
        <div>
            <div>
                <div>
                    <h3>Create an account</h3>
                    <form onSubmit={handleSubmit} >
                        <input required autoComplete='off' placeholder='First Name' type="text" name="firstName" id="firstName" />
                        <input required autoComplete='off' placeholder='Last Name' type="text" name="lastName" id="lastName" />
                        {!from && (
                            <>
                                <input autoComplete='off' placeholder='Username' type="text" name="username" id="username" />
                                <input autoComplete='off' placeholder='Email' type="text" name="email" id="email" />
                                <input autoComplete='off' placeholder='Password' type="password" name="password" id="password" />
                            </>
                        )}
                        <button ><FiUserPlus /> Submit</button>
                        <Link to='/login'>Already have an account ?</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register