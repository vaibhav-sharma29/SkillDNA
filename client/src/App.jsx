import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Analyze from './pages/Analyze'
import Report from './pages/Report'
import Compare from './pages/Compare'
import Candidate from './pages/Candidate'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a0f]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/report/:username" element={<Report />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/candidate" element={<Candidate />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
