import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav style={{ backgroundColor: 'var(--navbar-color)' }} className="text-white w-full h-16 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0 shadow-sm">
      <div className="font-semibold text-lg tracking-wide flex items-center gap-4">
        {/* Mobile menu button could go here in the future */}
        <Link to="/app">Employee Story Platform</Link>
      </div>

      <div className="flex items-center gap-4 cursor-pointer">
        <div className="flex flex-col text-right hidden sm:flex">
          <span className="text-sm font-medium">aditya.ranjan@triconinfotech.com</span>
          <span style={{ color: 'var(--light-grey-font-color)' }} className="text-xs">Employee</span>
        </div>
        <div
          style={{ backgroundColor: 'var(--primary-white-color)', color: 'var(--primary-text-color)' }}
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm"
        >
          AR
        </div>
      </div>
    </nav>
  )
}
