import { useRef, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthCallbackArgs, useAuth } from '../auth-provider'

function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const toast = useRef<any>(null)
    const auth = useAuth()
    const from = location.state?.from?.pathname || "/"
    const [loading, setLoading] = useState(false)
    const [credential, setCredential] = useState({
        username: '',
        password: ''
    })

    function login() {
        if (!credential.username || !credential.password) {
            toast.current.show({ severity: "error", summary: "Invalid Credential", detail: "Username and password are required." })
            return
        }

        setLoading(true)
        auth.signin(credential.username, credential.password, (e: AuthCallbackArgs) => {
            setLoading(false)
            if (!e.error) {
                navigate(from, { replace: true })
            }
        })
    }

    function handleChange(e: any) {
        setCredential({
            ...credential,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden p-input-filled">
            <div className="flex flex-column align-items-center justify-content-center">
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Welcome, Gomono!</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText onChange={handleChange} name='username' type="text" placeholder="Username" className="w-full mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password onChange={handleChange} name="password" placeholder="Password" toggleMask className="w-full mb-5" inputClassName='w-full p-3'></Password>

                            <Button loading={loading} label="Sign In" className="w-full p-3 text-xl" onClick={login}></Button>
                        </div>
                    </div>
                </div>
            </div>
            <Toast ref={toast} />
        </div>
    )
}

export default Login