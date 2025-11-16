class ActivitiesUtils {
  // Utility functions for activities feature

  /// Format a DateTime to a readable string
  static String formatDateTime(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  /// Get status color based on status
  static String getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'available':
        return '#4CAF50';
      case 'booked':
        return '#2196F3';
      case 'cancelled':
        return '#FF5252';
      case 'completed':
        return '#9C27B0';
      default:
        return '#9E9E9E';
    }
  }

  /// Get status text based on status code
  static String getStatusText(String status) {
    switch (status.toLowerCase()) {
      case 'available':
        return 'Available';
      case 'booked':
        return 'Booked';
      case 'cancelled':
        return 'Cancelled';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  }

  /// Calculate participants count message
  static String getParticipantsMessage(int current, int max) {
    if (current >= max) {
      return 'Full ($max participants)';
    } else {
      return '$current/$max participants';
    }
  }
}
