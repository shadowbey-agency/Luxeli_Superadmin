import 'package:flutter/material.dart';
import 'package:luxeli_app/features/notifications/providers/notification_provider.dart';
import 'package:luxeli_app/features/notifications/widgets/category_button.dart';
import 'package:luxeli_app/features/notifications/widgets/notification_item.dart';
import 'package:provider/provider.dart';
import '../models/notification_model.dart';


class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final notificationsProvider = Provider.of<NotificationsProvider>(context);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: const Color(0xFFF2F2F2),
                      shape: BoxShape.circle,
                      border: Border.all(color: const Color(0xFFE0E0E0), width: 1),
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.arrow_back, color: Colors.black, size: 20),
                      onPressed: () {
                      },
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      notificationsProvider.markAllAsRead();
                    },
                    child: const Text(
                      'Mark as read',
                      style: TextStyle(
                        color: Color(0xFF7F8C8D), // Grey color
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),
            // Notifications Title
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                'Notifications',
                style: TextStyle(
                  fontSize: 30,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
            ),
            const SizedBox(height: 25),
            // Category Buttons
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    CategoryButton(
                      text: 'All',
                      category: NotificationCategory.all,
                    ),
                    const SizedBox(width: 10),
                    CategoryButton(
                      text: 'Requests',
                      category: NotificationCategory.requests,
                    ),
                    const SizedBox(width: 10),
                    CategoryButton(
                      text: 'Hotel Messages',
                      category: NotificationCategory.hotelMessages,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            // Notification List
            Expanded(
              child: ListView.separated(
                padding: EdgeInsets.zero, // Remove default padding
                itemCount: notificationsProvider.notifications.length,
                itemBuilder: (context, index) {
                  final notification = notificationsProvider.notifications[index];
                  return NotificationItem(notification: notification);
                },
                separatorBuilder: (context, index) => const Divider(
                  height: 1,
                  color: Color(0xFFF2F2F2), // Light grey divider
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
