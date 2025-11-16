import 'package:flutter/material.dart';

class OnboardingPageIndicator extends StatelessWidget {
  final int currentPage;
  final int totalPages;

  const OnboardingPageIndicator({
    super.key,
    required this.currentPage,
    required this.totalPages,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(totalPages, (index) {
        return AnimatedContainer(
          duration: Duration(milliseconds: 300),
          margin: EdgeInsets.only(right: 8),
          width: _getIndicatorWidth(index),
          height: 10,
          decoration: BoxDecoration(
            color: _getIndicatorColor(index),
            borderRadius: BorderRadius.circular(5),
          ),
        );
      }),
    );
  }

  double _getIndicatorWidth(int index) {
    // Active indicator is wider (21px), inactive is circular (10px)
    if (index == currentPage) {
      return 21;
    }
    return 10;
  }

  Color _getIndicatorColor(int index) {
    if (index == currentPage) {
      return Color(0xFF56C6FF); // Active color (cyan blue)
    }
    return Color(0xFF212121).withValues(alpha: 0.06); // Inactive color (light gray)
  }
}
