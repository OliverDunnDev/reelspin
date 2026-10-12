import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import DashboardLayout from './layouts/DashboardLayout'

import Dashboard from './pages/Dashboard'
import Clubs from './pages/Clubs'
import Discover from './pages/Discover'
import History from './pages/History'
import Login from './pages/Login'
import ProtectedRoute from "./components/ProtectedRoute"
import Register from "./pages/Register"
import ClubDetails from "./pages/ClubDetails"
import Landing from './pages/Landing'
import Demo from './pages/Demo'

function App() {
  return (
    <BrowserRouter basename="/reelspin">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/clubs/:clubId" element={<ClubDetails />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/history" element={<History />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App