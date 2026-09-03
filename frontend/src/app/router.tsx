import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import AppLayout from '../components/layout/AppLayout'
import HomePage from '../pages/HomePage'
import MyStoriesPage from '../pages/MyStoriesPage'
import CreateStoryPage from '../pages/CreateStoryPage'
import StoryDetailsPage from '../pages/StoryDetailsPage'
import EditStoryPage from '../pages/EditStoryPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Authenticated Application Shell */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="stories" element={<MyStoriesPage />} />
          <Route path="stories/new" element={<CreateStoryPage />} />
          <Route path="stories/:storyId" element={<StoryDetailsPage />} />
          <Route path="stories/:storyId/edit" element={<EditStoryPage />} />
          <Route path="discover" element={
            <div>
              <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>Discover Stories</h1>
              <p style={{ color: 'var(--grey-font-color)' }}>Company stories will be listed here.</p>
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
