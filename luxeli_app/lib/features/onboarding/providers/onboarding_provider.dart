import 'package:flutter/material.dart';
import 'package:luxeli_app/core/constants/app_images.dart';
import 'package:luxeli_app/core/utils/app_logger.dart';
import '../models/onboarding_model.dart';

class OnboardingProvider extends ChangeNotifier {
  int _currentPage = 0;
  PageController? _pageController;

  int get currentPage => _currentPage;
  PageController get pageController {
    _pageController ??= PageController(initialPage: _currentPage);
    return _pageController!;
  }

  final List<OnboardingModel> _onboardingPages = [
    OnboardingModel(
      id: 0,
      title: 'Welcome to your smart hotel app',
      description:
          'Manage your stay, discover hotel services, and enjoy a personalized experience — all in one app.',
      imagePath: AppImages.onboarding1,
    ),
    OnboardingModel(
      id: 1,
      title: 'Your room, always perfect',
      description:
          'Request a full cleaning, fresh towels, or any housekeeping service whenever you need it.',
      imagePath: AppImages.onboarding2,
    ),
    OnboardingModel(
      id: 2,
      title: 'Book hotel services easily',
      description:
          'Reserve meeting rooms, spa sessions, or any internal hotel service in a few taps.',
      imagePath: AppImages.onboarding3,
    ),
    OnboardingModel(
      id: 3,
      title: 'Order room service instantly',
      description:
          'Browse our menu and order delicious meals delivered right to your room, anytime.',
      imagePath: AppImages.onboarding4,
    ),
    OnboardingModel(
      id: 4,
      title: 'Explore local recommendations',
      description:
          'Discover nearby attractions, restaurants, and experiences curated just for you.',
      imagePath: AppImages.onboarding5,
    ),
  ];

  List<OnboardingModel> get onboardingPages => _onboardingPages;
  int get totalPages => _onboardingPages.length;
  bool get isLastPage => _currentPage == _onboardingPages.length - 1;

  void initializePageController() {
    // PageController is now lazily initialized when accessed
    // This method can be kept for API compatibility but does nothing
  }

  void setCurrentPage(int page) {
    _currentPage = page;
    notifyListeners();
  }

  void nextPage() {
    if (_currentPage < _onboardingPages.length - 1) {
      _currentPage++;
      _pageController?.animateToPage(
        _currentPage,
        duration: Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
      notifyListeners();
    }
  }

  void skipToEnd() {
    _currentPage = _onboardingPages.length - 1;
    _pageController?.animateToPage(
      _currentPage,
      duration: Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
    notifyListeners();
  }

  void completeOnboarding() {
    // Logic to complete onboarding
    // This could navigate to the main app screen
    AppLogger.log('Onboarding completed!');
  }

  @override
  void dispose() {
    _pageController?.dispose();
    super.dispose();
  }
}
