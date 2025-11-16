import 'package:flutter/material.dart';
import '../models/onboarding_model.dart';
import 'onboarding_logo.dart';

class OnboardingPageContent extends StatelessWidget {
  final OnboardingModel onboardingData;

  const OnboardingPageContent({super.key, required this.onboardingData});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(flex: 5, child: _buildImageSection()),
        SizedBox(height: 30),
        Expanded(
          flex: 4,
          child: SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  OnboardingLogo(),
                  SizedBox(height: 20),
                  _buildTitle(),
                  SizedBox(height: 12),
                  _buildDescription(),
                ],
              ),
            ),
          ),
        ),

        SizedBox(height: 100),
      ],
    );
  }

  Widget _buildImageSection() {
    return Image.asset(
      onboardingData.imagePath,
      fit: BoxFit.cover,
      errorBuilder: (context, error, stackTrace) {
        return Container(
          color: Colors.grey[300],
          child: Center(
            child: Icon(
              Icons.image_not_supported,
              size: 50,
              color: Colors.grey[600],
            ),
          ),
        );
      },
    );
  }

  Widget _buildTitle() {
    return Text(
      onboardingData.title,
      style: TextStyle(
        fontFamily: 'Fustat',
        fontSize: 32,
        fontWeight: FontWeight.w800,
        color: Color(0xFF212121),
        height: 1.2,
        letterSpacing: -0.5,
      ),
    );
  }

  Widget _buildDescription() {
    return Text(
      onboardingData.description,
      style: TextStyle(
        fontFamily: 'Fustat',
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: Color(0xFF212121).withValues(alpha: 0.6),
        height: 1.4,
      ),
    );
  }
}
