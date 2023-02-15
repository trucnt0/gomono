import {
  Routes,
  Route,
} from "react-router-dom"
import { AuthProvider, RequireAuth } from './pages/AuthProvider'
import Projects from './pages/Projects'
import Layout from './pages/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Users from './pages/Users'
import Roles from './pages/Roles'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }>
          <Route index element={<Projects />} />
          <Route path='users' element={<Users />} />
          <Route path='roles' element={<Roles />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
