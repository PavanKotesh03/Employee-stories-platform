import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user, role } = useAuth();

  return (
    <div className="max-w-4xl mx-auto pb-12 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-text-color)' }}>My Profile</h1>
        <p className="text-[var(--grey-font-color)]">View and manage your account details.</p>
      </div>

      <div className="p-8 border border-[var(--light-grey-font-color)] bg-[var(--primary-white-color)] rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 pb-8 border-b border-[var(--light-grey-font-color)]">
          <div className="w-24 h-24 rounded-full bg-[var(--primary-color)] text-white flex items-center justify-center text-4xl font-bold shadow-sm shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--primary-text-color)' }}>{user?.name || 'Anonymous User'}</h2>
            <p className="text-[var(--grey-font-color)] font-medium mb-3">{user?.email}</p>
            <div className="inline-block px-3 py-1 bg-[var(--sidebar-bg-color)] border border-[var(--light-grey-font-color)] rounded-full text-sm font-semibold uppercase tracking-wider text-[var(--primary-text-color)]">
              Role: {role}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>Account Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[var(--grey-font-color)] uppercase tracking-wider font-semibold mb-1">User ID</p>
                <p className="font-mono text-xs break-all" style={{ color: 'var(--primary-text-color)' }}>{user?.id}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--grey-font-color)] uppercase tracking-wider font-semibold mb-1">Authentication</p>
                <p className="text-sm font-medium" style={{ color: 'var(--primary-text-color)' }}>Microsoft Entra ID (SSO)</p>
              </div>
            </div>
          </div>
          <div>
            <div className="p-6 bg-[var(--sidebar-bg-color)] rounded-lg border border-[var(--light-grey-font-color)] h-full">
              <h4 className="font-bold mb-2 text-sm" style={{ color: 'var(--primary-text-color)' }}>Profile Updates</h4>
              <p className="text-sm text-[var(--grey-font-color)] leading-relaxed">
                Currently, your name and email are automatically synchronized with your organization's Microsoft account directory. To change these details, please contact your IT administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
