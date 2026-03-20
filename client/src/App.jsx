import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import RecruiterDashboard from './pages/RecruiterDashboard'
import PostJob from './pages/PostJob'
import Jobs from './pages/Jobs'
import Apply from './pages/Apply'
import Candidate from './pages/Candidate'
import Report from './pages/Report'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a0f]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/recruiter/post-job" element={<PostJob />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:jobId/apply" element={<Apply />} />
          <Route path="/candidate" element={<Candidate />} />
          <Route path="/report/:username" element={<Report />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
