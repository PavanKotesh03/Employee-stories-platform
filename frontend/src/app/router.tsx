import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import AppLayout from '../components/layout/AppLayout'
import HomePage from '../pages/HomePage'
import MyStoriesPage from '../pages/MyStoriesPage'
import CreateStoryPage from '../pages/CreateStoryPage'
import StoryDetailsPage from '../pages/StoryDetailsPage'
import EditStoryPage from '../pages/EditStoryPage'
import ReviewQueuePage from '../pages/ReviewQueuePage'
import ManageUsersPage from '../pages/ManageUsersPage'
import DiscoverPage from '../pages/DiscoverPage'
import ProfilePage from '../pages/ProfilePage'

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
          <Route path="hr/reviews" element={<ReviewQueuePage />} />
          <Route path="admin/users" element={<ManageUsersPage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
