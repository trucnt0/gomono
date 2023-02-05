import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import axios from 'axios'
import httpClient from '../utils/HttpClient'

interface User {
    name: string
    userName: string
    email?: string
}

const authProvider = {
    isAuthenticated: false,
    signin(callback: VoidFunction) {
        authProvider.isAuthenticated = true
        setTimeout(callback, 100) // fake async
    },
    signout(callback: VoidFunction) {
        authProvider.isAuthenticated = false
        setTimeout(callback, 100)
    },
}

interface AuthContextType {
    user: any
    signin: (user: string, password: string, callback: VoidFunction) => void
    signout: (callback: VoidFunction) => void
}

const AuthContext = React.createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<any>()

    const signin = async (username: string, password: string, callback: VoidFunction) => {
        const result = await httpClient.post<any, { token: string }>('api/login', { username, password })
        localStorage.setItem('token', result.token)

        return authProvider.signin(() => {
            setUser(username)
            callback()
        })
    }

    const signout = (callback: VoidFunction) => {
        return authProvider.signout(() => {
            setUser(null)
            callback()
        })
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
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}
