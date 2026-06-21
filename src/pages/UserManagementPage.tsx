import { useState } from 'react'
import { MainLayout } from '@/layouts/MainLayout'
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '@/hooks/useQueries'
import type { UserData } from '@/types'

/**
 * User Management Page
 */
export const UserManagementPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer',
    department: '',
  })

  const usersQuery = useUsers()
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()

  const users = usersQuery.data || []

  const handleAddUser = () => {
    setEditingUser(null)
    setFormData({ name: '', email: '', role: 'viewer', department: '' })
    setIsModalOpen(true)
  }

  const handleEditUser = (user: UserData) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingUser) {
        await updateMutation.mutateAsync({
          userId: editingUser.id,
          updates: {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            department: formData.department,
          },
        })
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          department: formData.department,
          status: 'active',
          lastLogin: new Date().toISOString(),
        })
      }
      setIsModalOpen(false)
      setFormData({ name: '', email: '', role: 'viewer', department: '' })
    } catch (error) {
      console.error('Submit failed:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteMutation.mutateAsync(userId)
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
  }

  return (
    <MainLayout pageTitle='User Management'>
      <div className='space-y-6'>
        {/* Header and Add Button */}
        <div className='flex justify-between items-center'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>Users</h3>
            <p className='text-gray-600 text-sm'>
              Manage system users and permissions
            </p>
          </div>
          <button
            onClick={handleAddUser}
            className='bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
          >
            <span className='material-symbols-outlined'>add</span>
            Add User
          </button>
        </div>

        {/* Users Table */}
        <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
          <div className='overflow-x-auto'>
            {usersQuery.isLoading ? (
              <div className='p-12 text-center'>
                <div className='animate-spin mb-4 inline-block'>
                  <span className='material-symbols-outlined text-3xl text-blue-600'>
                    autorenew
                  </span>
                </div>
                <p className='text-gray-600'>Loading users...</p>
              </div>
            ) : users.length > 0 ? (
              <table className='w-full text-sm'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-3 text-left font-semibold text-gray-900'>
                      Name
                    </th>
                    <th className='px-6 py-3 text-left font-semibold text-gray-900'>
                      Email
                    </th>
                    <th className='px-6 py-3 text-left font-semibold text-gray-900'>
                      Role
                    </th>
                    <th className='px-6 py-3 text-left font-semibold text-gray-900'>
                      Department
                    </th>
                    <th className='px-6 py-3 text-left font-semibold text-gray-900'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left font-semibold text-gray-900'>
                      Last Login
                    </th>
                    <th className='px-6 py-3 text-right font-semibold text-gray-900'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {users.map((user) => (
                    <tr key={user.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-3 text-gray-900 font-medium'>
                        {user.name}
                      </td>
                      <td className='px-6 py-3 text-gray-600'>{user.email}</td>
                      <td className='px-6 py-3'>
                        <span className='px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded'>
                          {user.role}
                        </span>
                      </td>
                      <td className='px-6 py-3 text-gray-600'>
                        {user.department}
                      </td>
                      <td className='px-6 py-3'>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className='px-6 py-3 text-gray-600'>
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-3 text-right'>
                        <div className='flex gap-2 justify-end'>
                          <button
                            onClick={() => handleEditUser(user)}
                            className='text-blue-600 hover:text-blue-800 transition-colors'
                          >
                            <span className='material-symbols-outlined text-sm'>
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className='text-red-600 hover:text-red-800 transition-colors'
                          >
                            <span className='material-symbols-outlined text-sm'>
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='p-12 text-center text-gray-600'>
                No users found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Form Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg shadow-lg w-full max-w-md'>
            <div className='flex justify-between items-center p-6 border-b border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900'>
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className='text-gray-600 hover:text-gray-900'
              >
                <span className='material-symbols-outlined'>close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>
                  Name
                </label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>
                  Email
                </label>
                <input
                  type='email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value='admin'>Admin</option>
                  <option value='editor'>Editor</option>
                  <option value='viewer'>Viewer</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>
                  Department
                </label>
                <input
                  type='text'
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              <div className='flex gap-3 pt-4'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='flex-1 border border-gray-300 text-gray-900 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className='flex-1 bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
