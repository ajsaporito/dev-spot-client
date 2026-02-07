import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
//import "./index.css";
import "./styles/style.css";


import App from './App.jsx'
import { CreateJobPage } from './pages/CreateJobPage.jsx'
import Dashboard from "./pages/Dashboard.jsx";
import FindJobsPage from "./pages/FindJobsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

import NotFound from './pages/NotFound.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="create-job" element={<CreateJobPage />} />
           <Route path="find-jobs" element={<FindJobsPage />} />
           <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
