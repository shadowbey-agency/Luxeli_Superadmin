import 'package:flutter/material.dart';
import 'package:luxeli_app/features/notifications/providers/notification_provider.dart';
import 'package:provider/provider.dart';
import '../models/notification_model.dart';

class CategoryButton extends StatelessWidget {
  final String text;
  final NotificationCategory category;

  const CategoryButton({
    super.key,
    required this.text,
    required this.category,
  });

  @override
  Widget build(BuildContext context) {
    final notificationsProvider = Provider.of<NotificationsProvider>(context);
    final bool isSelected = notificationsProvider.selectedCategory == category;

    return GestureDetector(
      onTap: () {
        notificationsProvider.setSelectedCategory(category);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFE8E8E8) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? Colors.transparent : const Color(0xFFE8E8E8),
            width: 1,
          ),
        ),
        child: Text(
          text,
          style: TextStyle(
            color: isSelected ? const Color(0xFF2C3E50) : const Color(0xFF7F8C8D),
            fontSize: 15,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}
