import { Link, useNavigate } from 'react-router-dom';
import { DropdownMenu } from '@radix-ui/themes';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
  };

  return (
    <nav style={{ backgroundColor: 'var(--navbar-color)' }} className="text-white w-full h-16 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0 shadow-sm">
      <div className="font-semibold text-lg tracking-wide flex items-center gap-4">
        {/* Mobile menu button could go here in the future */}
        <Link to="/app">Employee Story Platform</Link>
      </div>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-sm font-medium">{user?.email || 'Loading...'}</span>
              <span style={{ color: 'var(--light-grey-font-color)' }} className="text-xs capitalize">{role || 'Employee'}</span>
            </div>
            <div
              style={{ backgroundColor: 'var(--primary-white-color)', color: 'var(--primary-text-color)' }}
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm"
            >
              {getInitials(user?.name)}
            </div>
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" size="2">
          <DropdownMenu.Item onClick={() => navigate('/app/profile')}>
            Profile
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item color="red" onClick={logout}>
            Log Out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </nav>
  )
}
