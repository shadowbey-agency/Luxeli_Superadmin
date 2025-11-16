import 'package:flutter/material.dart';
import 'package:luxeli_app/core/constants/app_images.dart';
import 'package:luxeli_app/features/home/widgets/content_header.dart';
import 'package:luxeli_app/features/home/widgets/latest_services_section.dart';
import 'package:provider/provider.dart';
import '../providers/home_provider.dart';
import '../widgets/activity_cards_section.dart';
import '../widgets/most_requested_section.dart';
import '../widgets/onboarding_overlay.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF2D3F5D),
      body: Stack(
        children: [
          Positioned.fill(
            child: Image.asset(
              AppImages.homev4,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(color: Color(0xFF2D3F5D));
              },
            ),
          ),
          Positioned(
            top: 80,
            left: 0,
            right: 0,
            child: Center(
              child: RichText(
                text: TextSpan(
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                  children: [
                    TextSpan(
                      text: 'Welcome to ',
                      style: TextStyle(color: Colors.grey.shade300),
                    ),
                    TextSpan(
                      text: 'Château Meridian',
                      style: TextStyle(color: Colors.white),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Column(
            children: [
              SizedBox(height: 100),
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(30),
                      topRight: Radius.circular(30),
                    ),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(30),
                      topRight: Radius.circular(30),
                    ),
                    child: SingleChildScrollView(
                      physics: BouncingScrollPhysics(),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ContentHeader(),
                          SizedBox(height: 16),
                          ActivityCardsSection(),
                          SizedBox(height: 20),
                          LatestServicesSection(),
                          SizedBox(height: 20),
                          MostRequestedSection(),
                          SizedBox(height: 100),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
          Consumer<HomeProvider>(
            builder: (context, provider, child) {
              if (provider.showOnboarding) {
                return OnboardingOverlay();
              }
              return SizedBox.shrink();
            },
          ),
        ],
      ),
    );
  }
}
