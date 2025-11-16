import 'package:flutter/material.dart';

enum NotificationCategory {
  all,
  requests,
  hotelMessages,
}

class NotificationModel {
  final String id;
  final String title;
  final String description;
  final String timeAgo;
  final bool isUnread;
  final NotificationCategory category;
  final Color? backgroundColor;

  NotificationModel({
    required this.id,
    required this.title,
    required this.description,
    required this.timeAgo,
    this.isUnread = false,
    this.category = NotificationCategory.all,
    this.backgroundColor,
  });
}
