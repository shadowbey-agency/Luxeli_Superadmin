import 'package:flutter/material.dart';
import '../models/notification_model.dart';

class NotificationItem extends StatelessWidget {
  final NotificationModel notification;

  const NotificationItem({
    super.key,
    required this.notification,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: notification.backgroundColor ?? Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  notification.title,
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
              ),
              if (notification.isUnread)
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: Colors.red,
                    shape: BoxShape.circle,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 5),
          Text(
            notification.description,
            style: const TextStyle(
              fontSize: 15,
              color: Color(0xFF7F8C8D),
            ),
          ),
          const SizedBox(height: 5),
          Text(
            notification.timeAgo,
            style: const TextStyle(
              fontSize: 13,
              color: Color(0xFFBDC3C7), 
            ),
          ),
        ],
      ),
    );
  }
}
