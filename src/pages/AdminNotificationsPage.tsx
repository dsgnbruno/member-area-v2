import React, { useState, useEffect } from 'react';
import { Notification } from '../types';
import { Edit, Trash2, Plus, Search, Save, X, Bell } from 'lucide-react';

// NocoDB configuration for Notifications
const NOTIFICATIONS_NOCODB_CONFIG = {
  host: 'https://nocodb.bbtqj1.easypanel.host/',
  baseId: 'pzezd6u18bjbe4r',
  tableId: 'mmxvujfvnn3dyki',
  apiToken: 'ugotnKik_E0FBXkZsdwdARlwWvNTqQg7R2Kirriy',
};

const AdminNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newNotification, setNewNotification] = useState<Partial<Notification>>({
    title: '',
    description: '',
    couponCode: '',
    discount: 0,
    expiryDate: new Date().toISOString().split('T')[0],
    isActive: true
  });

  // Fetch notifications from NocoDB
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${NOTIFICATIONS_NOCODB_CONFIG.host}api/v1/db/data/noco/${NOTIFICATIONS_NOCODB_CONFIG.baseId}/${NOTIFICATIONS_NOCODB_CONFIG.tableId}`,
        {
          headers: {
            'xc-token': NOTIFICATIONS_NOCODB_CONFIG.apiToken,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }

      const data = await response.json();
      const notificationsList = data.list || [];
      setNotifications(notificationsList);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again later.');
      // Use empty array for demonstration if API fails
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter notifications based on search term
  const filteredNotifications = notifications.filter(notification => 
    notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.couponCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle notification creation
  const handleCreateNotification = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${NOTIFICATIONS_NOCODB_CONFIG.host}api/v1/db/data/noco/${NOTIFICATIONS_NOCODB_CONFIG.baseId}/${NOTIFICATIONS_NOCODB_CONFIG.tableId}`,
        {
          method: 'POST',
          headers: {
            'xc-token': NOTIFICATIONS_NOCODB_CONFIG.apiToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newNotification)
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create notification: ${response.status}`);
      }

      // Refresh notifications list
      await fetchNotifications();
      setIsCreating(false);
      setNewNotification({
        title: '',
        description: '',
        couponCode: '',
        discount: 0,
        expiryDate: new Date().toISOString().split('T')[0],
        isActive: true
      });
    } catch (err) {
      console.error('Error creating notification:', err);
      setError('Failed to create notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle notification update
  const handleUpdateNotification = async () => {
    if (!editingNotification) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `${NOTIFICATIONS_NOCODB_CONFIG.host}api/v1/db/data/noco/${NOTIFICATIONS_NOCODB_CONFIG.baseId}/${NOTIFICATIONS_NOCODB_CONFIG.tableId}/${editingNotification.id}`,
        {
          method: 'PATCH',
          headers: {
            'xc-token': NOTIFICATIONS_NOCODB_CONFIG.apiToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editingNotification)
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update notification: ${response.status}`);
      }

      // Refresh notifications list
      await fetchNotifications();
      setEditingNotification(null);
    } catch (err) {
      console.error('Error updating notification:', err);
      setError('Failed to update notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle notification deletion
  const handleDeleteNotification = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `${NOTIFICATIONS_NOCODB_CONFIG.host}api/v1/db/data/noco/${NOTIFICATIONS_NOCODB_CONFIG.baseId}/${NOTIFICATIONS_NOCODB_CONFIG.tableId}/${id}`,
        {
          method: 'DELETE',
          headers: {
            'xc-token': NOTIFICATIONS_NOCODB_CONFIG.apiToken
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete notification: ${response.status}`);
      }

      // Refresh notifications list
      await fetchNotifications();
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Failed to delete notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        <div className="bg-base-100 rounded-box p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Notifications</h1>
            <button 
              className="btn btn-primary"
              onClick={() => setIsCreating(true)}
              disabled={isCreating || !!editingNotification}
            >
              <Plus size={18} /> Add New Notification
            </button>
          </div>
          
          {/* Search */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-base-content/50" />
            </div>
            <input
              type="text"
              placeholder="Search notifications..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Error message */}
          {error && (
            <div className="alert alert-error mb-4">
              <div>{error}</div>
            </div>
          )}
          
          {/* Create Notification Form */}
          {isCreating && (
            <div className="bg-base-200 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Add New Notification</h2>
                <button 
                  className="btn btn-sm btn-ghost"
                  onClick={() => setIsCreating(false)}
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-control">
                  <label className="label">Title</label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">Coupon Code</label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    value={newNotification.couponCode}
                    onChange={(e) => setNewNotification({...newNotification, couponCode: e.target.value})}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">Discount (%)</label>
                  <input 
                    type="number" 
                    className="input input-bordered" 
                    value={newNotification.discount}
                    onChange={(e) => setNewNotification({...newNotification, discount: Number(e.target.value)})}
                    min="0"
                    max="100"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">Expiry Date</label>
                  <input 
                    type="date" 
                    className="input input-bordered" 
                    value={newNotification.expiryDate}
                    onChange={(e) => setNewNotification({...newNotification, expiryDate: e.target.value})}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">Status</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="toggle toggle-primary" 
                      checked={newNotification.isActive}
                      onChange={(e) => setNewNotification({...newNotification, isActive: e.target.checked})}
                    />
                    <span>{newNotification.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>
              
              <div className="form-control mb-4">
                <label className="label">Description</label>
                <textarea 
                  className="textarea textarea-bordered h-24" 
                  value={newNotification.description}
                  onChange={(e) => setNewNotification({...newNotification, description: e.target.value})}
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  className="btn btn-ghost"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleCreateNotification}
                  disabled={loading || !newNotification.title}
                >
                  {loading ? <span className="loading loading-spinner"></span> : <Save size={18} />} Save Notification
                </button>
              </div>
            </div>
          )}
          
          {/* Edit Notification Form */}
          {editingNot<boltArtifact id="fix-admin-pages" title="Fix Admin Pages">
<boltAction type="file" filePath="src/pages/AdminNotificationsPage.tsx">ification && (
            <div className="bg-base-200 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Edit Notification</h2>
                <button 
                  className="btn btn-sm btn-ghost"
                  onClick={() => setEditingNotification(null)}
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-control">
                  <label className="label">Title</label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    value={editingNotification.title}
                    onChange={(e) => setEditingNotification({...editingNotification, title: e.target.value})}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">Coupon Code</label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    value={editingNotification.couponCode}
                    onChange={(e) => setEditingNotification({...editingNotification, couponCode: e.target.value})}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">Discount (%)</label>
                  <input 
                    type="number" 
                    className="input input-bordered" 
                    value={editingNotification.discount}
                    onChange={(e) => setEditingNotification({...editingNotification, discount: Number(e.target.value)})}
                    min="0"
                    max="100"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">Expiry Date</label>
                  <input 
                    type="date" 
                    className="input input-bordered" 
                    value={editingNotification.expiryDate}
                    onChange={(e) => setEditingNotification({...editingNotification, expiryDate: e.target.value})}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">Status</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="toggle toggle-primary" 
                      checked={editingNotification.isActive}
                      onChange={(e) => setEditingNotification({...editingNotification, isActive: e.target.checked})}
                    />
                    <span>{editingNotification.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>
              
              <div className="form-control mb-4">
                <label className="label">Description</label>
                <textarea 
                  className="textarea textarea-bordered h-24" 
                  value={editingNotification.description}
                  onChange={(e) => setEditingNotification({...editingNotification, description: e.target.value})}
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  className="btn btn-ghost"
                  onClick={() => setEditingNotification(null)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleUpdateNotification}
                  disabled={loading}
                >
                  {loading ? <span className="loading loading-spinner"></span> : <Save size={18} />} Update Notification
                </button>
              </div>
            </div>
          )}
          
          {/* Notifications Table */}
          {loading && !isCreating && !editingNotification ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Coupon</th>
                    <th>Discount</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifications.map(notification => (
                    <tr key={notification.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                              <Bell size={20} className="text-primary" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{notification.title}</div>
                            <div className="text-sm opacity-50 truncate max-w-xs">{notification.description}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-outline font-mono">{notification.couponCode}</div>
                      </td>
                      <td>{notification.discount}%</td>
                      <td>
                        {new Date(notification.expiryDate).toLocaleDateString()}
                      </td>
                      <td>
                        <div className={`badge ${notification.isActive ? 'badge-success' : 'badge-warning'}`}>
                          {notification.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => setEditingNotification(notification)}
                            disabled={!!editingNotification || isCreating}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline btn-error"
                            onClick={() => handleDeleteNotification(notification.id)}
                            disabled={loading}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg">No notifications found</p>
              {searchTerm && (
                <button 
                  className="btn btn-outline mt-4"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationsPage;
