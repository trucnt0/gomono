import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import httpClient from '../utils/HttpClient'
import decodeJwt from 'jwt-decode'
import { toast } from 'react-toastify'

export interface AuthCallbackArgs {
    token?: string
    error?: string
}

type CallbackFunction = (args: AuthCallbackArgs) => void

interface AuthUserClaims {
    aud: string[]
    exp: number
    iat: number
    userName: string
}

interface AuthContextType {
    user: any
    signin: (user: string, password: string, callback: CallbackFunction) => void
    signout: (callback: CallbackFunction) => void
}

const AuthContext = React.createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<any>()

    const signin = async (username: string, password: string, callback: CallbackFunction) => {
        try {
            const { token } = await httpClient.post<any, { token: string }>('api/login', { username, password })
            const decode = decodeJwt<AuthUserClaims>(token)
            setUser(decode.userName)
            localStorage.setItem('token', token)
            callback({ token })
        }
        catch (e: any) {
            callback({ error: e.message })
        }
    }

    //TODO: 
    const signout = (callback: CallbackFunction) => {
        console.log('Signing out...')
        callback({})
    }

    const value = { user, signin, signout }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    return React.useContext(AuthContext)
}

export function RequireAuth({ children }: { children: JSX.Element }) {
    let auth = useAuth()
    let location = useLocation()

    if (!auth.user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}
