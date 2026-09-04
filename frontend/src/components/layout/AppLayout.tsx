import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <div className="h-screen flex flex-col w-full overflow-hidden bg-[var(--primary-white-color)]">
      <Navbar />
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
