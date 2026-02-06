import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import "./index.css";
import "./styles/style.css";


import App from './App.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import { CreateJobPage } from './pages/CreateJobPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="create-job" element={<CreateJobPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
