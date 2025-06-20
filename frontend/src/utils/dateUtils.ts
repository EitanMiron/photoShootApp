// Format date to readable string
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format time to readable string
export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

// Format duration in minutes to readable string
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`;
};

// Generate available time slots
export const getAvailableTimeSlots = (): string[] => {
  const slots: string[] = [];
  const startHour = 9; // 9 AM
  const endHour = 18; // 6 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  
  return slots;
};

// Check if a date is in the past
export const isPastDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Get minimum date for date inputs (today)
export const getMinDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Check if a booking time conflicts with existing bookings
export const hasTimeConflict = (
  newBooking: { date: string; time: string; duration: number },
  existingBookings: Array<{ date: string; time: string; duration: number }>
): boolean => {
  const newStart = new Date(`${newBooking.date}T${newBooking.time}`);
  const newEnd = new Date(newStart.getTime() + newBooking.duration * 60000);
  
  return existingBookings.some(booking => {
    if (booking.date !== newBooking.date) return false;
    
    const existingStart = new Date(`${booking.date}T${booking.time}`);
    const existingEnd = new Date(existingStart.getTime() + booking.duration * 60000);
    
    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });
}; 