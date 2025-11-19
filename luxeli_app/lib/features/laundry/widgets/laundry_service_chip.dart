import 'package:flutter/material.dart';
import '../models/laundry_item.dart';

class LaundryServiceChip extends StatelessWidget {
  final LaundryItem service;
  final bool isSelected;
  final VoidCallback onTap;

  const LaundryServiceChip({
    super.key,
    required this.service,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 100,
        height: 100,
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF0D47A1) : Colors.grey[100],
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? const Color(0xFF0D47A1) : Colors.transparent,
            width: 2,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              service.icon,
              size: 30,
              color: isSelected ? Colors.white : Colors.grey[700],
            ),
            const SizedBox(height: 8),
            Text(
              service.name,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: isSelected ? Colors.white : Colors.grey[800],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
