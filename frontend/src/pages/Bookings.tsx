import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import type { Booking } from '../types';
import { formatDate, formatTime, formatDuration } from '../utils/dateUtils';
import BookingForm from '../components/BookingForm';

const Bookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.getBookings();
      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        setError(response.error || 'Failed to load bookings');
      }
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingCreated = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    setShowBookingForm(false);
    setEditingBooking(null);
  };

  const handleBookingUpdated = (updatedBooking: Booking) => {
    setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
    setShowBookingForm(false);
    setEditingBooking(null);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    setError('');
    try {
      const response = await apiService.deleteBooking(bookingId);
      if (response.success) {
        setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      } else {
        setError(response.error || 'Failed to cancel booking');
      }
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setShowBookingForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  if (loading) {
    return (
      <div className="bookings-page">
        <div className="loading-container">
          <div className="loading-spinner">Loading bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <h2>My Bookings</h2>
        <button 
          className="create-booking-btn"
          onClick={() => { setShowBookingForm(true); setEditingBooking(null); }}
        >
          + New Booking
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showBookingForm && (
        <BookingForm 
          onBookingCreated={handleBookingCreated}
          onBookingUpdated={handleBookingUpdated}
          onCancel={() => { setShowBookingForm(false); setEditingBooking(null); }}
          editingBooking={editingBooking}
        />
      )}

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <h3>No bookings yet</h3>
          <p>Start by creating your first photo shoot booking!</p>
          <button 
            className="cta-button"
            onClick={() => { setShowBookingForm(true); setEditingBooking(null); }}
          >
            Book Your First Session
          </button>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.type.charAt(0).toUpperCase() + booking.type.slice(1)} Photography</h3>
                <span className={`status-badge ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              
              <div className="booking-details">
                <div className="detail-item">
                  <span className="label">Date:</span>
                  <span>{formatDate(booking.date)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Time:</span>
                  <span>{formatTime(booking.time)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Duration:</span>
                  <span>{formatDuration(booking.duration)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Location:</span>
                  <span>{booking.location}</span>
                </div>
                {booking.notes && (
                  <div className="detail-item">
                    <span className="label">Notes:</span>
                    <span>{booking.notes}</span>
                  </div>
                )}
              </div>

              <div className="booking-actions">
                {booking.status === 'pending' && (
                  <>
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleEditBooking(booking)}
                    >
                      Edit
                    </button>
                    <button 
                      className="action-btn cancel-btn"
                      onClick={() => handleDeleteBooking(booking.id)}
                    >
                      Cancel
                    </button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <button 
                    className="action-btn cancel-btn"
                    onClick={() => handleDeleteBooking(booking.id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings; 