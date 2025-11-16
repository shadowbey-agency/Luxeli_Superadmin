import 'package:flutter/material.dart';

class ActivitiesStyles {
  // Text styles
  static const TextStyle titleLarge = TextStyle(
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: Color(0xFF333333),
  );

  static const TextStyle titleMedium = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: Color(0xFF333333),
  );

  static const TextStyle bodyLarge = TextStyle(
    fontSize: 16,
    color: Color(0xFF333333),
  );

  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14,
    color: Color(0xFF666666),
  );

  static const TextStyle bodySmall = TextStyle(
    fontSize: 12,
    color: Color(0xFF999999),
  );

  // Button styles
  static ButtonStyle primaryButtonStyle = ElevatedButton.styleFrom(
    backgroundColor: Color(0xFF2196F3),
    foregroundColor: Colors.white,
    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
  );

  static ButtonStyle secondaryButtonStyle = OutlinedButton.styleFrom(
    foregroundColor: Color(0xFF2196F3),
    side: BorderSide(color: Color(0xFF2196F3)),
    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
  );

  // Card styles
  static BoxDecoration cardDecoration = BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(12),
    border: Border.all(color: Color(0xFFE0E0E0)),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withValues(alpha: 0.05),
        blurRadius: 4,
        offset: Offset(0, 2),
      ),
    ],
  );
}
