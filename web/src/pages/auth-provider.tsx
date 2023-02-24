import React, { useEffect } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import httpClient from '../utils/http-client'
import LocalStorageHelper from '../utils/localstorage-helper'
import jwtDecode from 'jwt-decode'

export interface AuthCallbackArgs {
    token?: string
    refreshToken?: string
    error?: string
}

type CallbackFunction = (args: AuthCallbackArgs) => void

interface AuthContextType {
    user: UserClaims
    refreshUser: VoidFunction
    signin: (user: string, password: string, callback: CallbackFunction) => void
    signout: (callback: CallbackFunction) => void
}

const AuthContext = React.createContext<AuthContextType>(null!)

export const TOKEN = 'token'
export const REFRESH_TOKEN = 'refresh_token'

interface AuthResponse {
    token: string
    refreshToken: string
}

interface AuthRequest {
    username: string
    password: string
}

interface UserClaims {
    sub: string
    name: string
    email: string
    exp: number
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<any>()

    const signin = async (username: string, password: string, callback: CallbackFunction) => {
        try {
            const { token, refreshToken } = await httpClient.post<AuthRequest, AuthResponse>('api/login', { username, password })
            LocalStorageHelper.set(TOKEN, token)
            setUser(jwtDecode<UserClaims>(token))
            callback({ token, refreshToken })
        }
        catch (e: any) {
            callback({ error: e.message })
        }
    }

    const signout = (callback: CallbackFunction) => {
        LocalStorageHelper.remove(TOKEN)
        callback({})
    }

    const refreshUser = () => {
        const token = LocalStorageHelper.get(TOKEN)
        setUser(jwtDecode<UserClaims>(token!))
    }

    const value = { user, refreshUser, signin, signout }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    return React.useContext(AuthContext)
}

export function RequireAuth({ children }: { children: JSX.Element }) {
    const token = LocalStorageHelper.get(TOKEN)
    const location = useLocation()

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}
