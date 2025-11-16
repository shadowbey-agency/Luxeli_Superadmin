class LaundryUtils {
  // Utility functions for laundry feature

  /// Format a DateTime to a readable string
  static String formatDateTime(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  /// Get status color based on status
  static String getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FFC107';
      case 'in progress':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#FF5252';
      default:
        return '#9E9E9E';
    }
  }

  /// Get status text based on status code
  static String getStatusText(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'in progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  }

  /// Calculate estimated completion time
  static String calculateEstimatedTime(String serviceType, String priority) {
    // Base time in hours
    int baseTime = 24; // Default 24 hours

    switch (serviceType.toLowerCase()) {
      case 'wash and fold':
        baseTime = 24;
        break;
      case 'dry cleaning':
        baseTime = 48;
        break;
      case 'ironing':
        baseTime = 12;
        break;
    }

    switch (priority.toLowerCase()) {
      case 'express':
        return '${(baseTime ~/ 2)} hours';
      case 'same day':
        return 'Same day';
      default:
        return '$baseTime hours';
    }
  }
}
