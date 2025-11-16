import 'package:flutter/material.dart';
import 'package:luxeli_app/core/constants/app_images.dart';
import 'package:luxeli_app/features/get_started/providers/language_provider.dart';
import 'package:luxeli_app/features/get_started/widgets/language_bottom_sheet.dart';
import 'package:provider/provider.dart';

class LanguageSelectionScreen extends StatelessWidget {
  const LanguageSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<LanguageProvider>().initializeLanguages();
    });

    return Scaffold(
      body: Stack(
        children: [
          _buildBlurredBackground(),
          _buildBlurredContent(),
          Align(
            alignment: Alignment.bottomCenter,
            child: LanguageBottomSheet(),
          ),
        ],
      ),
    );
  }

  Widget _buildBlurredBackground() {
    return Container(
      decoration: BoxDecoration(
        image: DecorationImage(
          image: AssetImage(AppImages.splashBackground),
          fit: BoxFit.cover,
          colorFilter: ColorFilter.mode(
            Colors.black.withValues(alpha: 0.3),
            BlendMode.darken,
          ),
        ),
      ),
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Colors.transparent, Colors.white.withValues(alpha: 0.8)],
            stops: [0.0, 0.7],
          ),
        ),
      ),
    );
  }

  Widget _buildBlurredContent() {
    return Positioned(
      top: 430,
      left: 24,
      right: 24,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 150,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.grey.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          SizedBox(height: 24),
          Container(
            width: double.infinity,
            height: 80,
            decoration: BoxDecoration(
              color: Colors.grey.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ],
      ),
    );
  }
}
