import 'package:flutter/material.dart';
import 'package:dotted_border/dotted_border.dart';

class PrimaryButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final double? width;
  final bool isDottedBorder; // Add parameter for dotted border

  const PrimaryButton({
    super.key,
    required this.text,
    this.onPressed,
    this.width,
    this.isDottedBorder = false, // Default to false
  });

  @override
  Widget build(BuildContext context) {
    Widget buttonContent = Container(
      width: width ?? 351,
      height: 48,
      decoration: BoxDecoration(
        color: Color(0xFF01286B),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(10),
          child: Center(
            child: Text(
              text,
              style: TextStyle(
                fontFamily: 'Fustat',
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.white,
                height: 1.56,
              ),
            ),
          ),
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
        radius: Radius.circular(10),
        child: buttonContent,
      );
    }

    return buttonContent;
  }
}
