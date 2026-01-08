/**
 * Admin Dashboard Page
 *
 * Provides administrative functionality for:
 * - Site statistics and analytics overview
 * - User management (view, edit, activate/deactivate, promote)
 * - Content moderation (resources approval, forum moderation)
 *
 * Access restricted to users with is_admin=true.
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import * as adminService from '../services/adminService';
import { getCategories, getThreadsByCategory } from '../services/forumService';
import type {
  DashboardStats,
  AdminUser,
  PendingResource,
  ForumCategory,
  ForumThread
} from '@/types';
import '../styles/admin.css';

type AdminTab = 'overview' | 'users' | 'content' | 'resources';

interface AdminDashboardPageProps {
  onNavigate: (page: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Overview state
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Users state
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userFilter, setUserFilter] = useState<'all' | 'active' | 'inactive' | 'admin'>('all');
  const PAGE_SIZE = 20;

  // Client-side filtered and paginated users
  const filteredUsers = useMemo(() => {
    let filtered = allUsers;

    // Apply status filter
    if (userFilter === 'active') {
      filtered = filtered.filter(u => u.is_active);
    } else if (userFilter === 'inactive') {
      filtered = filtered.filter(u => !u.is_active);
    } else if (userFilter === 'admin') {
      filtered = filtered.filter(u => u.is_admin);
    }

    // Apply search filter
    if (userSearch.trim()) {
      const search = userSearch.toLowerCase();
      filtered = filtered.filter(u =>
        u.username.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [allUsers, userFilter, userSearch]);

  const paginatedUsers = useMemo(() => {
    const start = (userPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, userPage]);

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

  // Content state (forum)
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | null>(null);
  const [threads, setThreads] = useState<ForumThread[]>([]);

  // Resources state
  const [pendingResources, setPendingResources] = useState<PendingResource[]>([]);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setUserPage(1);
  }, [userFilter, userSearch]);

  const loadTabData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      switch (activeTab) {
        case 'overview':
          const statsData = await adminService.getStats();
          setStats(statsData);
          break;

        case 'users':
          // Load all users for client-side filtering
          const usersResponse = await adminService.getUsers({ page: 1, page_size: 1000 });
          setAllUsers(usersResponse.users);
          break;

        case 'content':
          const cats = await getCategories();
          setCategories(cats);
          break;

        case 'resources':
          const pending = await adminService.getPendingResources();
          setPendingResources(pending);
          break;
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { detail?: string | object } } };
      let errorMessage = 'Failed to load data';
      if (axiosError.response?.data?.detail) {
        const detail = axiosError.response.data.detail;
        errorMessage = typeof detail === 'string' ? detail : JSON.stringify(detail);
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // Load data when active tab changes - always fetch fresh data
  useEffect(() => {
    loadTabData();
  }, [loadTabData]);

  const handleUpdateUser = async (userId: string, updates: { is_active?: boolean; is_admin?: boolean }) => {
    try {
      const updatedUser = await adminService.updateUser(userId, updates);
      // Update local state
      setAllUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { detail?: string } } };
      setError(axiosError.response?.data?.detail || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"? This cannot be undone.`)) return;
    try {
      await adminService.deleteUser(userId);
      // Find the user before removing to update stats correctly
      const deletedUser = allUsers.find(u => u.id === userId);
      // Update local state with new array
      const updatedUsers = allUsers.filter(u => u.id !== userId);
      setAllUsers(updatedUsers);
      // Update stats
      if (stats && deletedUser) {
        setStats({
          ...stats,
          total_users: stats.total_users - 1,
          active_users: deletedUser.is_active ? stats.active_users - 1 : stats.active_users,
          admin_users: deletedUser.is_admin ? stats.admin_users - 1 : stats.admin_users
        });
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { detail?: string } } };
      setError(axiosError.response?.data?.detail || 'Failed to delete user');
    }
  };

  const handleApproveResource = async (resourceId: string) => {
    try {
      await adminService.approveResource(resourceId);
      setPendingResources(prev => prev.filter(r => r.id !== resourceId));
      // Refresh stats if visible
      if (stats) {
        setStats({
          ...stats,
          pending_resources: stats.pending_resources - 1,
          approved_resources: stats.approved_resources + 1
        });
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { detail?: string } } };
      setError(axiosError.response?.data?.detail || 'Failed to approve resource');
    }
  };

  const handleRejectResource = async (resourceId: string) => {
    if (!confirm('Are you sure you want to reject and delete this resource?')) return;
    try {
      await adminService.rejectResource(resourceId);
      setPendingResources(prev => prev.filter(r => r.id !== resourceId));
      if (stats) {
        setStats({
          ...stats,
          pending_resources: stats.pending_resources - 1
        });
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { detail?: string } } };
      setError(axiosError.response?.data?.detail || 'Failed to reject resource');
    }
  };

  const handlePinThread = async (threadId: string, isPinned: boolean) => {
    try {
      if (isPinned) {
        await adminService.unpinThread(threadId);
      } else {
        await adminService.pinThread(threadId);
      }
      // Reload threads for selected category
      if (selectedCategory) {
        const updatedThreads = await getThreadsByCategory(selectedCategory.id);
        setThreads(updatedThreads);
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { detail?: string } } };
      setError(axiosError.response?.data?.detail || 'Failed to update thread');
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    if (!confirm('Are you sure you want to delete this thread? This cannot be undone.')) return;
    try {
      await adminService.deleteThread(threadId);
      setThreads(prev => prev.filter(t => t.id !== threadId));
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { detail?: string } } };
      setError(axiosError.response?.data?.detail || 'Failed to delete thread');
    }
  };

  const loadCategoryThreads = async (category: ForumCategory) => {
    setSelectedCategory(category);
    try {
      const threadData = await getThreadsByCategory(category.id);
      setThreads(threadData);
    } catch (err) {
      setError('Failed to load threads');
    }
  };

  // Render functions for each tab
  const renderOverview = () => (
    <div className="admin-overview">
      <h2>Dashboard Overview</h2>
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Users</h3>
            <div className="stat-value">{stats.total_users}</div>
            <div className="stat-detail">
              {stats.active_users} active | {stats.admin_users} admins
            </div>
          </div>
          <div className="stat-card">
            <h3>New Users (7 days)</h3>
            <div className="stat-value">{stats.users_created_last_7_days}</div>
            <div className="stat-detail">
              {stats.users_created_last_30_days} in last 30 days
            </div>
          </div>
          <div className="stat-card">
            <h3>Forum Activity</h3>
            <div className="stat-value">{stats.total_forum_threads}</div>
            <div className="stat-detail">
              threads | {stats.total_forum_replies} replies
            </div>
          </div>
          <div className="stat-card highlight">
            <h3>Pending Resources</h3>
            <div className="stat-value">{stats.pending_resources}</div>
            <div className="stat-detail">
              {stats.approved_resources} approved
            </div>
          </div>
          <div className="stat-card">
            <h3>Study Groups</h3>
            <div className="stat-value">{stats.total_study_groups}</div>
          </div>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="admin-users">
      <h2>User Management</h2>

      <div className="users-controls">
        <input
          type="text"
          placeholder="Search users..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="user-search-input"
        />
        <select
          value={userFilter}
          onChange={(e) => {
            setUserFilter(e.target.value as 'all' | 'active' | 'inactive' | 'admin');
            setUserPage(1);
          }}
          className="user-filter-select"
        >
          <option value="all">All Users</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
          <option value="admin">Admins Only</option>
        </select>
      </div>

      {allUsers.length > 0 && (
        <>
          <div className="users-summary">
            Showing {paginatedUsers.length} of {filteredUsers.length} users
            {userSearch && ` matching "${userSearch}"`}
          </div>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map(u => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`status-badge ${u.is_active ? 'active' : 'inactive'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <span className={`role-badge ${u.is_admin ? 'admin' : 'user'}`}>
                        {u.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button
                        onClick={() => handleUpdateUser(u.id, { is_active: !u.is_active })}
                        className={u.is_active ? 'btn-deactivate' : 'btn-activate'}
                      >
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      {u.id !== user?.id && (
                        <>
                          <button
                            onClick={() => handleUpdateUser(u.id, { is_admin: !u.is_admin })}
                            className="btn-toggle-admin"
                          >
                            {u.is_admin ? 'Remove Admin' : 'Make Admin'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id, u.username)}
                            className="btn-delete-user"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={userPage <= 1}
                onClick={() => setUserPage(p => p - 1)}
              >
                Previous
              </button>
              <span>Page {userPage} of {totalPages}</span>
              <button
                disabled={userPage >= totalPages}
                onClick={() => setUserPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderContent = () => (
    <div className="admin-content">
      <h2>Forum Moderation</h2>

      <div className="content-layout">
        <div className="categories-panel">
          <h3>Categories</h3>
          {categories.length === 0 ? (
            <p className="no-content">No categories found</p>
          ) : (
            categories.map(cat => (
              <div
                key={cat.id}
                className={`category-item ${selectedCategory?.id === cat.id ? 'selected' : ''}`}
                onClick={() => loadCategoryThreads(cat)}
              >
                <span>{cat.name}</span>
              </div>
            ))
          )}
        </div>

        <div className="threads-panel">
          {selectedCategory ? (
            <>
              <h3>Threads in {selectedCategory.name}</h3>
              {threads.length === 0 ? (
                <p className="no-content">No threads in this category</p>
              ) : (
                <div className="threads-list">
                  {threads.map(thread => (
                    <div key={thread.id} className="thread-item">
                      <div className="thread-info">
                        <span className="thread-title">
                          {thread.is_pinned && <span className="pin-icon">📌</span>}
                          {thread.title}
                        </span>
                        <span className="thread-meta">
                          Created: {new Date(thread.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="thread-actions">
                        <button
                          onClick={() => handlePinThread(thread.id, thread.is_pinned)}
                          className="btn-pin"
                        >
                          {thread.is_pinned ? 'Unpin' : 'Pin'}
                        </button>
                        <button
                          onClick={() => handleDeleteThread(thread.id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="no-content">Select a category to view threads</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="admin-resources">
      <h2>Pending Resources ({pendingResources.length})</h2>

      {pendingResources.length === 0 ? (
        <p className="no-pending">No pending resources to review</p>
      ) : (
        <div className="pending-resources-list">
          {pendingResources.map(resource => (
            <div key={resource.id} className="pending-resource-card">
              <div className="resource-header">
                <h3>{resource.title}</h3>
                <span className="resource-type">{resource.resource_type}</span>
              </div>
              {resource.description && (
                <p className="resource-description">{resource.description}</p>
              )}
              {resource.url && (
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-url">
                  {resource.url}
                </a>
              )}
              <div className="resource-meta">
                <span>Submitted by: {resource.submitter_username}</span>
                <span>{new Date(resource.created_at).toLocaleDateString()}</span>
              </div>
              <div className="resource-actions">
                <button
                  onClick={() => handleApproveResource(resource.id)}
                  className="btn-approve"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRejectResource(resource.id)}
                  className="btn-reject"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-dashboard-page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <button onClick={() => onNavigate('landing')} className="back-button">
          Back to Home
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="admin-tabs">
        <button
          className={activeTab === 'overview' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'users' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'content' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('content')}
        >
          Forum
        </button>
        <button
          className={activeTab === 'resources' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('resources')}
        >
          Resources
          {stats && stats.pending_resources > 0 && (
            <span className="badge">{stats.pending_resources}</span>
          )}
        </button>
      </div>

      <div className="admin-content-area">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'content' && renderContent()}
            {activeTab === 'resources' && renderResources()}
          </>
        )}
      </div>
    </div>
  );
};
