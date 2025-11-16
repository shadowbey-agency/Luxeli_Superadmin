class HousekeepingUtils {
  // Utility functions for housekeeping feature

  /// Format a DateTime to a readable string
  static String formatDateTime(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  /// Get priority color based on priority level
  static String getPriorityColor(String priority) {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return '#FF5252';
      case 'medium':
        return '#FFC107';
      case 'low':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  }

  /// Get status text based on status code
  static String getStatusText(String status) {
    switch (status.toLowerCase()) {
      case 'new':
        return 'New';
      case 'accepted':
        return 'Accepted';
      case 'completed':
        return 'Completed';
      case 'canceled':
        return 'Canceled';
      default:
        return status;
    }
  }

  /// Calculate estimated completion time
  static String calculateEstimatedTime(String priority) {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return '30 minutes';
      case 'medium':
        return '1 hour';
      case 'low':
        return '2 hours';
      default:
        return '1 hour';
    }
  }
}
