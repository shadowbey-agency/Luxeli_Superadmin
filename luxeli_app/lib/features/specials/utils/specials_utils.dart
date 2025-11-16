class SpecialsUtils {
  // Utility functions for specials feature

  /// Format a DateTime to a readable string
  static String formatDateTime(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  /// Get status color based on status
  static String getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'active':
        return '#4CAF50';
      case 'expired':
        return '#FF5252';
      case 'upcoming':
        return '#FFC107';
      default:
        return '#9E9E9E';
    }
  }

  /// Get status text based on status code
  static String getStatusText(String status) {
    switch (status.toLowerCase()) {
      case 'active':
        return 'Active';
      case 'expired':
        return 'Expired';
      case 'upcoming':
        return 'Upcoming';
      default:
        return status;
    }
  }

  /// Calculate discount percentage text
  static String getDiscountText(double discount) {
    return '${discount.toStringAsFixed(0)}% off';
  }
}
