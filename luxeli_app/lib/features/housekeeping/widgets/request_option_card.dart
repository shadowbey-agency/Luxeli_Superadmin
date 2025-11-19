import 'package:flutter/material.dart';

class RequestOptionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;

  const RequestOptionCard({
    super.key,
    required this.icon,
    required this.title,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
        decoration: BoxDecoration(
          color: const Color(0xFFF5F5F5), // Light grey background
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: const Color(0xFFE0E0E0),
            width: 1,
          ), // Subtle border
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 36,
              color: const Color(0xFF333333),
            ), // Dark grey icon
            const SizedBox(height: 12),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Color(0xFF333333),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
