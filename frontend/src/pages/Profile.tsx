import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await apiService.updateUser(user!.id, form);
      if (response.success && response.data) {
        setSuccess('Profile updated!');
        setShowEdit(false);
        localStorage.setItem('user', JSON.stringify(response.data));
        window.location.reload();
      } else {
        setError(response.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }
    try {
      const response = await apiService.changePassword(user!.id, passwords.current, passwords.new);
      if (response.success) {
        setSuccess('Password changed!');
        setShowPassword(false);
      } else {
        setError(response.error || 'Failed to change password');
      }
    } catch (err) {
      setError('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await apiService.deleteUser(user!.id);
      if (response.success) {
        setSuccess('Account deleted');
        logout();
      } else {
        setError(response.error || 'Failed to delete account');
      }
    } catch (err) {
      setError('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>My Profile</h2>
        <div className="profile-info">
          <div className="profile-section">
            <h3>Account Info</h3>
            <div className="info-grid">
              <div className="info-item"><label>Name:</label><span>{user.name}</span></div>
              <div className="info-item"><label>Email:</label><span>{user.email}</span></div>
              <div className="info-item"><label>Phone:</label><span>{user.phone}</span></div>
            </div>
          </div>
          <div className="profile-section">
            <h3>Account Actions</h3>
            <div className="action-buttons">
              <button className="action-button" onClick={() => setShowEdit(true)}>Edit Profile</button>
              <button className="action-button" onClick={() => setShowPassword(true)}>Change Password</button>
              <button className="action-button" onClick={() => setShowDelete(true)}>Delete Account</button>
            </div>
          </div>
        </div>
        {showEdit && (
          <div className="booking-form-overlay">
            <div className="booking-form-container">
              <div className="booking-form-header">
                <h3>Edit Profile</h3>
                <button className="close-btn" onClick={() => setShowEdit(false)}>×</button>
              </div>
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              <form onSubmit={handleEdit} className="booking-form">
                <div className="form-group">
                  <label>Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowEdit(false)} disabled={loading}>Cancel</button>
                  <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showPassword && (
          <div className="booking-form-overlay">
            <div className="booking-form-container">
              <div className="booking-form-header">
                <h3>Change Password</h3>
                <button className="close-btn" onClick={() => setShowPassword(false)}>×</button>
              </div>
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              <form onSubmit={handlePassword} className="booking-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input className="form-input" type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input className="form-input" type="password" value={passwords.new} onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input className="form-input" type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} required />
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowPassword(false)} disabled={loading}>Cancel</button>
                  <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showDelete && (
          <div className="booking-form-overlay">
            <div className="booking-form-container">
              <div className="booking-form-header">
                <h3>Delete Account</h3>
                <button className="close-btn" onClick={() => setShowDelete(false)}>×</button>
              </div>
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              <p>Are you sure you want to delete your account? This action cannot be undone.</p>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowDelete(false)} disabled={loading}>Cancel</button>
                <button type="button" className="submit-btn" onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 