import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/onboarding_provider.dart';
import '../widgets/onboarding_page_content.dart';
import '../widgets/onboarding_page_indicator.dart';
import '../widgets/onboarding_skip_button.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final provider = context.read<OnboardingProvider>();
      provider.initializePageController();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Consumer<OnboardingProvider>(
        builder: (context, provider, child) {
          return Stack(
            children: [
              PageView.builder(
                controller: provider.pageController,
                onPageChanged: (index) {
                  provider.setCurrentPage(index);
                },
                itemCount: provider.totalPages,
                itemBuilder: (context, index) {
                  return OnboardingPageContent(
                    onboardingData: provider.onboardingPages[index],
                  );
                },
              ),
              Positioned(
                left: 20,
                bottom: 30,
                child: SafeArea(
                  child: OnboardingPageIndicator(
                    currentPage: provider.currentPage,
                    totalPages: provider.totalPages,
                  ),
                ),
              ),
              Positioned(
                right: 20,
                bottom: 20,
                child: SafeArea(
                  child: OnboardingSkipButton(
                    isLastPage: provider.isLastPage,
                    onSkip: () {
                      if (provider.isLastPage) {
                        provider.completeOnboarding();
                        if (context.mounted) {
                          Navigator.of(
                            context,
                          ).pushReplacementNamed('/get-started');
                        }
                      } else {
                        provider.skipToEnd();
                      }
                    },
                    onNext: () {
                      if (provider.isLastPage) {
                        provider.completeOnboarding();
                        if (context.mounted) {
                          Navigator.of(
                            context,
                          ).pushReplacementNamed('/get-started');
                        }
                      } else {
                        provider.nextPage();
                      }
                    },
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
