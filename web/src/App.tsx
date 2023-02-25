import { Routes, Route } from "react-router-dom"
import { AuthProvider, RequireAuth } from './pages/auth-provider'
import { ToastProvider } from './pages/toast-provider'
import Layout from './components/layout'
import Register from './pages/auth/register'
import Projects from './pages/project/projects'
import Login from './pages/auth/login'
import Dashboard from './pages/dashboard'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path='/' element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }>
            <Route index element={<Dashboard />} />
            <Route path='projects' element={<Projects />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
