import React, { useRef, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Toast, ToastMessage } from 'primereact/toast'
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
        <div className="flex flex-row justify-content-center mt-6">
            <Card title="Login" subTitle="Welcome to GOMONO" className="w-30rem">
                <div className="flex flex-column gap-2">
                    <InputText name='username' onChange={handleChange} placeholder='Username'></InputText>
                    <InputText name='password' onChange={handleChange} type='password' placeholder='Password'></InputText>
                    <Button onClick={login} loading={loading} label='Login'></Button>
                    <Button label='Register' severity="warning"></Button>
                </div>
            </Card>
            <Toast ref={toast} />
        </div>
    )
}

export default Login