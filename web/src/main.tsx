import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import App from './App'
import "./index.scss"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Suspense fallback={<p>Loading...</p>}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Suspense>
)
