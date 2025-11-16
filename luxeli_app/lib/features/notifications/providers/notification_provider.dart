import 'package:flutter/material.dart';
import '../models/notification_model.dart';

class NotificationsProvider with ChangeNotifier {
  NotificationCategory _selectedCategory = NotificationCategory.all;
  NotificationCategory get selectedCategory => _selectedCategory;

  List<NotificationModel> _notifications = [
    NotificationModel(
      id: '1',
      title: 'Housekeeping request accepted',
      description: 'Your cleaning request is scheduled for tomorrow at 10:00 AM.',
      timeAgo: '3 hours ago.',
      isUnread: true,
      category: NotificationCategory.requests,
      backgroundColor: const Color(0xFFFEEAEA), // Light red background
    ),
    NotificationModel(
      id: '2',
      title: 'New cleaning request status',
      description: 'Your room cleaning request is now "In progress".',
      timeAgo: '3 hours ago.',
      category: NotificationCategory.requests,
    ),
    NotificationModel(
      id: '3',
      title: 'Delivery completed',
      description: 'Your requested towels and water bottles have been delivered.',
      timeAgo: '3 hours ago.',
      category: NotificationCategory.requests,
    ),
    NotificationModel(
      id: '4',
      title: 'Welcome to Royal Sunset Hotel',
      description: 'We\'re delighted to have you. Discover our services in the app menu.',
      timeAgo: '3 hours ago.',
      category: NotificationCategory.hotelMessages,
    ),
    NotificationModel(
      id: '5',
      title: 'Important notice',
      description: 'Maintenance will take place in the pool area tomorrow from 2 PM to 5 PM.',
      timeAgo: '3 hours ago.',
      category: NotificationCategory.hotelMessages,
    ),
    // Add more dummy data if needed
  ];

  List<NotificationModel> get notifications {
    if (_selectedCategory == NotificationCategory.all) {
      return _notifications;
    } else {
      return _notifications
          .where((notification) => notification.category == _selectedCategory)
          .toList();
    }
  }

  void setSelectedCategory(NotificationCategory category) {
    _selectedCategory = category;
    notifyListeners();
  }

  void markAllAsRead() {
    _notifications = _notifications.map((notification) {
      return NotificationModel(
        id: notification.id,
        title: notification.title,
        description: notification.description,
        timeAgo: notification.timeAgo,
        isUnread: false, // Mark as read
        category: notification.category,
        backgroundColor: notification.backgroundColor,
      );
    }).toList();
    notifyListeners();
  }
}
