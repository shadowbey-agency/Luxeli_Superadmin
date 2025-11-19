import 'package:flutter/material.dart';

class ProfileListItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? value;
  final bool showArrow;
  final VoidCallback? onTap;

  const ProfileListItem({
    super.key,
    required this.icon,
    required this.title,
    this.value,
    this.showArrow = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Row(
          children: [
            Icon(
              icon,
              color: const Color(0xFF424242),
              size: 24,
            ), // Dark grey icon
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  color: Color(0xFF424242), // Dark grey text
                  fontWeight: FontWeight.w500,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            if (value != null)
              Text(
                value!,
                style: const TextStyle(
                  fontSize: 16,
                  color: Color(0xFF757575), // Medium grey value text
                  fontWeight: FontWeight.w400,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            if (showArrow) ...[
              const SizedBox(width: 8),
              Icon(
                Icons.arrow_forward_ios,
                color: const Color(0xFFBDBDBD),
                size: 16,
              ), // Light grey arrow
            ],
          ],
        ),
      ),
    );
  }
}
