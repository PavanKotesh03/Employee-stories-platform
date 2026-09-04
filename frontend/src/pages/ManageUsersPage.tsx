import { useState, useEffect } from 'react';
import { adminApi, User } from '../api/adminApi';

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'employee' | 'hr' | 'admin') => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      alert("Failed to update user role");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to deactivate this user?")) return;
    try {
      await adminApi.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[var(--grey-font-color)]">Loading users...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-[var(--primary-text-color)]">Manage Users</h1>
          <p className="text-[var(--grey-font-color)]">View and manage roles for all employees.</p>
        </div>
      </div>

      <div className="bg-[var(--primary-white-color)] rounded-xl border border-[var(--light-grey-font-color)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--sidebar-bg-color)] border-b border-[var(--light-grey-font-color)]">
                <th className="p-4 font-semibold text-[var(--primary-text-color)]">Employee ID</th>
                <th className="p-4 font-semibold text-[var(--primary-text-color)]">Name</th>
                <th className="p-4 font-semibold text-[var(--primary-text-color)]">Email</th>
                <th className="p-4 font-semibold text-[var(--primary-text-color)]">Role</th>
                <th className="p-4 font-semibold text-[var(--primary-text-color)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[var(--light-grey-font-color)] last:border-0 hover:bg-black/5 transition-colors">
                  <td className="p-4 text-sm text-[var(--font-color)] font-medium">{user.employee_id}</td>
                  <td className="p-4 text-sm text-[var(--font-color)]">{user.full_name}</td>
                  <td className="p-4 text-sm text-[var(--font-color)]">{user.email}</td>
                  <td className="p-4 text-sm">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                      className="p-1 rounded border border-[var(--light-grey-font-color)] bg-transparent text-[var(--font-color)] outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                    >
                      <option value="employee">Employee</option>
                      <option value="hr">HR</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4 text-sm">
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
