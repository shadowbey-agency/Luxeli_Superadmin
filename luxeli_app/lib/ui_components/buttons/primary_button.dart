import 'package:flutter/material.dart';
import 'package:dotted_border/dotted_border.dart';

class PrimaryButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final String text;
  final IconData? icon;
  final bool isLoading;
  final bool isDottedBorder; // Add parameter for dotted border

  const PrimaryButton({
    super.key,
    required this.onPressed,
    required this.text,
    this.icon,
    this.isLoading = false,
    this.isDottedBorder = false, // Default to false
  });

  @override
  Widget build(BuildContext context) {
    Widget buttonContent = SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF003366),
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 0,
        ),
        child: isLoading
            ? const CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (icon != null) ...[
                    Icon(icon, size: 20),
                    const SizedBox(width: 8),
                  ],
                  Text(
                    text,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
      ),
    );

    // Wrap with dotted border if requested
    if (isDottedBorder) {
      return DottedBorder(
        color: Colors.black,
        strokeWidth: 1,
        dashPattern: [5, 5], // 5 pixels dash, 5 pixels gap
        borderType: BorderType.RRect,
        radius: Radius.circular(16),
        child: buttonContent,
      );
    }

    return buttonContent;
  }
}
