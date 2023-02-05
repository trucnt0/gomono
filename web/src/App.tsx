import { lazy, useState } from 'react'
import {
  Routes,
  Route,
} from "react-router-dom"
import { AuthProvider, RequireAuth } from './pages/AuthProvider'
import Projects from './pages/Projects'
import Layout from './pages/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import IAM from './pages/IAM'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }>
          <Route index element={<Projects />} />
          <Route path='iam' element={<IAM />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
