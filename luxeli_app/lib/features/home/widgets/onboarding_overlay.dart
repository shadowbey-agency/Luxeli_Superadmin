import 'package:flutter/material.dart';
import 'package:luxeli_app/core/constants/app_icons.dart';
import 'package:luxeli_app/core/constants/app_images.dart';
import 'package:luxeli_app/ui_components/widgets/svg_icon.dart';
import 'package:provider/provider.dart';
import '../providers/home_provider.dart';
import 'dart:ui';

class OnboardingOverlay extends StatelessWidget {
  const OnboardingOverlay({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Color(0xFF2D3F5D).withValues(alpha: 0.85),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Stack(
          children: [
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.all(20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Hi there 👋',
                      style: TextStyle(
                        fontFamily: 'Fustat',
                        fontSize: 28,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                    SizedBox(height: 16),
                    Text(
                      'All your hotel services are now\nright here — easy to reach\nanytime.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontFamily: 'Fustat',
                        fontSize: 16,
                        fontWeight: FontWeight.w400,
                        color: Colors.white.withValues(alpha: 0.9),
                        height: 1.4,
                      ),
                    ),
                    SizedBox(height: 32),
                    GestureDetector(
                      onTap: () {
                        context.read<HomeProvider>().dismissOnboarding();
                      },
                      child: Container(
                        padding: EdgeInsets.symmetric(
                          horizontal: 40,
                          vertical: 14,
                        ),
                        decoration: BoxDecoration(
                          color: Color(0xFF01286B),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          'Alright, got it',
                          style: TextStyle(
                            fontFamily: 'Fustat',
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    SizedBox(height: 20),
                    Image.asset(AppImages.frame),
                    SizedBox(height: 20),
                    Container(
                      width: 55,
                      height: 62,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 3),
                      ),
                      child: SvgIcon(assetName: AppIcons.menuSquare),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
