import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
//import "./index.css";
import "./styles/style.css";


import App from './App.jsx'
import { CreateJobPage } from './pages/CreateJobPage.jsx'
import {FindJobsPage} from "./pages/FindJobsPage.jsx";
import HireTalentPage from "./pages/HireTalentPage.jsx";
import {HybridDashboard} from "./pages/HybridDashboard.jsx";
import { JobDetailPage } from './pages/JobDetailPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { MessagesPage } from "./pages/MessagesPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import {SignupPage} from './pages/SignupPage.jsx';
import TalentProfilePage from "./pages/TalentProfilePage";
import NotFound from './pages/NotFound.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HybridDashboard />} />
          <Route path="create-job" element={<CreateJobPage />} />
          <Route path="dashboard" element={<HybridDashboard />} />
          <Route path="find-jobs" element={<FindJobsPage />} />
          <Route path="hire-talent" element={<HireTalentPage />} />
          <Route path="job/:id" element={<JobDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="talent" element={<TalentProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

//<Route path="talent/:id" element={<TalentProfilePage />} />