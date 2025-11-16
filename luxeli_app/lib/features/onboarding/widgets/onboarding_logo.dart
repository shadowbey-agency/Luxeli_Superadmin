import 'package:flutter/material.dart';
import 'package:luxeli_app/core/constants/app_images.dart';

class OnboardingLogo extends StatelessWidget {
  const OnboardingLogo({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 43,
      width: 129,
      child: Image.asset(AppImages.logo, fit: BoxFit.contain),
    );
  }
}
