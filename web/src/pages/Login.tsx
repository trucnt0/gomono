import { useNavigate, useLocation, Link } from 'react-router-dom'
import { AuthCallbackArgs, useAuth } from './AuthProvider'
import { FiLogIn } from 'react-icons/fi'
import React, { FC, useState } from 'react'
import Loader from '../components/Loader'
import { toast } from 'react-toastify'

const Login: FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const auth = useAuth()
    const from = location.state?.from?.pathname || "/"
    const [loading, setLoading] = useState(false)

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData(event.currentTarget)
        const username = formData.get("username") as string
        const password = formData.get('password') as string
        setLoading(true)
        auth.signin(username, password, (e: AuthCallbackArgs) => {
            setLoading(false)
            if (!e.error) {
                navigate(from, { replace: true })
            }
        })
    }

    return (
        <div className="flex text-center justify-center h-screen py-52 bg-no-repeat bg-cover bg-center bg-fixed">
            <div>
                {!loading && (
                    <div className='p-10 flex items-center flex-col bg-white rounded border shadow-xl'>
                        <h3 className='text-5xl mb-10'>Login to continue</h3>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-4/5'>
                            <input required autoComplete='off' placeholder='Username' className='f-input' type="text" name="username" id="username" />
                            <input required autoComplete='off' placeholder='Password' className='f-input' type="password" name="password" id="password" />
                            <button className='f-btn f-primary'><FiLogIn /> Sign In</button>
                            <Link to='/register'>Don't have account ?</Link>
                        </form>
                    </div>
                )}
                {loading && <Loader full />}
            </div>
        </div>
    )
}

export default Login
