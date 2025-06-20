import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { Booking } from '../types';
import { getAvailableTimeSlots } from '../utils/dateUtils';

interface BookingFormProps {
  onBookingCreated: (booking: Booking) => void;
  onBookingUpdated?: (booking: Booking) => void;
  onCancel: () => void;
  editingBooking?: Booking | null;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookingCreated, onBookingUpdated, onCancel, editingBooking }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: 60,
    location: '',
    type: 'portrait' as const,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingBooking) {
      setFormData({
        date: editingBooking.date,
        time: editingBooking.time,
        duration: editingBooking.duration,
        location: editingBooking.location,
        type: editingBooking.type,
        notes: editingBooking.notes || '',
      });
    } else {
      setFormData({
        date: '',
        time: '',
        duration: 60,
        location: '',
        type: 'portrait',
        notes: '',
      });
    }
  }, [editingBooking]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingBooking && onBookingUpdated) {
        // Update existing booking
        const response = await apiService.updateBooking(editingBooking.id, formData);
        if (response.success && response.data) {
          onBookingUpdated(response.data);
        } else {
          setError(response.error || 'Failed to update booking');
        }
      } else {
        // Create new booking
        const response = await apiService.createBooking({
          ...formData,
          userId: '', // This will be set by the backend based on the authenticated user
        });
        if (response.success && response.data) {
          onBookingCreated(response.data);
        } else {
          setError(response.error || 'Failed to create booking');
        }
      }
    } catch (err) {
      setError('Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = getAvailableTimeSlots();

  return (
    <div className="booking-form-overlay">
      <div className="booking-form-container">
        <div className="booking-form-header">
          <h3>{editingBooking ? 'Edit Booking' : 'Book a Photo Session'}</h3>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Session Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="portrait">Portrait Photography</option>
                <option value="wedding">Wedding Photography</option>
                <option value="event">Event Photography</option>
                <option value="commercial">Commercial Photography</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration (minutes)</label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
                <option value={240}>4 hours</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="form-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Time</label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Select a time</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter location (e.g., Studio, Park, Client's Home)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Additional Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-input"
              placeholder="Any special requirements or details..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (editingBooking ? 'Updating...' : 'Creating Booking...') : (editingBooking ? 'Update Booking' : 'Create Booking')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm; 