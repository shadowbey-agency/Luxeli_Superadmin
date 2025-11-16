import 'package:flutter/material.dart';

class OnboardingSkipButton extends StatelessWidget {
  final bool isLastPage;
  final VoidCallback onSkip;
  final VoidCallback onNext;

  const OnboardingSkipButton({
    super.key,
    required this.isLastPage,
    required this.onSkip,
    required this.onNext,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (!isLastPage)
          GestureDetector(
            onTap: onSkip,
            child: Text(
              'Skip',
              style: TextStyle(
                fontFamily: 'Fustat',
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Color(0xFF212121),
                height: 1.4,
              ),
            ),
          ),

        SizedBox(width: 20),

        GestureDetector(
          onTap: onNext,
          child: Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: Color(0xFF1F2A44),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Center(
              child: Icon(Icons.arrow_forward, color: Colors.white, size: 20),
            ),
          ),
        ),
      ],
    );
  }
}
