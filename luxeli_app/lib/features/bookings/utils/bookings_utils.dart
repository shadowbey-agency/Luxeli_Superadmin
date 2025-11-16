class BookingsUtils {
  // Utility functions for bookings feature

  /// Format a DateTime to a readable string
  static String formatDateTime(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  /// Get status color based on status
  static String getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FFC107';
      case 'confirmed':
        return '#4CAF50';
      case 'cancelled':
        return '#FF5252';
      case 'completed':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  }

  /// Get status text based on status code
  static String getStatusText(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'cancelled':
        return 'Cancelled';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  }

  /// Calculate duration between two dates
  static String calculateDuration(DateTime start, DateTime end) {
    final difference = end.difference(start);
    final hours = difference.inHours;
    final minutes = difference.inMinutes % 60;

    if (hours > 0) {
      return '$hours hr $minutes min';
    } else {
      return '$minutes min';
    }
  }
}
