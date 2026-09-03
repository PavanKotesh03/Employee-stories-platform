import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  const navItems = [
    { label: 'Home', path: '/app' },
    { label: 'My Stories', path: '/app/stories' },
    { label: 'Discover', path: '/app/discover' },
    { label: 'Profile', path: '/app/profile' },
  ]

  return (
    <aside 
      style={{ backgroundColor: 'var(--sidebar-bg-color)' }} 
      className="w-full md:w-64 flex-shrink-0 border-r border-[var(--light-grey-font-color)] overflow-y-auto flex flex-col h-auto md:h-full"
    >
      <nav className="flex flex-col py-6 px-4 gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) => 
              `px-4 py-3 rounded-md transition-colors text-sm font-medium ${
                isActive 
                  ? 'bg-opacity-10 font-semibold' 
                  : 'hover:bg-black/5'
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'rgba(118, 24, 25, 0.1)' : 'transparent',
              color: isActive ? 'var(--primary-color)' : 'var(--font-color)'
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
