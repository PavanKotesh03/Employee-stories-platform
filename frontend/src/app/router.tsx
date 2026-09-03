import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import AppLayout from '../components/layout/AppLayout'
import RoleGuard from '../components/layout/RoleGuard'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Authenticated Application Shell */}
        <Route path="/app" element={<RoleGuard><AppLayout /></RoleGuard>}>
          <Route index element={
            <div>
              <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>Home Dashboard</h1>
              <p style={{ color: 'var(--grey-font-color)' }}>Welcome to the Employee Story Platform.</p>
            </div>
          } />
          <Route path="stories" element={
            <div>
              <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>Stories</h1>
              <p style={{ color: 'var(--grey-font-color)' }}>Company stories will be listed here.</p>
            </div>
          } />
          <Route path="my-story" element={
            <div>
              <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>My Story</h1>
              <p style={{ color: 'var(--grey-font-color)' }}>Edit your story here.</p>
            </div>
          } />
          <Route path="profile" element={
            <div>
              <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>Profile</h1>
              <p style={{ color: 'var(--grey-font-color)' }}>Manage your profile here.</p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
