import { Toast } from 'primereact/toast'
import { createContext, useContext, useRef } from 'react'

interface LayoutContextData {
    success: (message: string) => void
    error: (error: string) => void
    warn: (warn: string) => void
}

const LayoutContext = createContext<LayoutContextData>(null!)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {

    const toast = useRef<any>(null)

    const success = (message: string) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: message })
    }

    const error = (error: string) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: error })
    }

    const warn = (warning: string) => {
        toast.current.show({ severity: 'warn', summary: 'Warning', detail: warning })
    }

    const value = { success, error, warn }

    return (
        <LayoutContext.Provider value={value}>
            {children}
            <Toast ref={toast} />
        </LayoutContext.Provider>
    )
}

export function useToast() {
    return useContext(LayoutContext)
}