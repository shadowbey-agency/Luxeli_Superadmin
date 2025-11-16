import 'package:flutter/material.dart';
import 'package:luxeli_app/features/main/main_screen.dart';
import '../../features/splash/views/splash_screen.dart';
import '../../features/get_started/views/language_selection.dart';
import '../../features/onboarding/views/onboarding_screen.dart';
import '../../features/get_started/views/get_started_main_screen.dart';
import '../../features/get_started/views/confirm_info_screen.dart';
import '../../features/housekeeping/views/housekeeping_screen.dart';
import '../../features/cleaning_services/views/cleaning_services_screen.dart';
import '../../features/notifications/views/notification_screen.dart';
import '../../features/bookings/views/booking_screen.dart';
import '../../features/qr_login/views/qr_scanner_screen.dart';

class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/':
        return MaterialPageRoute(builder: (_) => SplashScreen());
      case '/language-selection':
        return MaterialPageRoute(builder: (_) => LanguageSelectionScreen());
      case '/onboarding':
        return MaterialPageRoute(builder: (_) => OnboardingScreen());
      case '/get-started':
        return MaterialPageRoute(builder: (_) => GetStartedMainScreen());
      case '/confirmation':
        return MaterialPageRoute(builder: (_) => ConfirmInfoScreen());
      case '/home':
        return MaterialPageRoute(builder: (_) => const MainScreen());
      case '/housekeeping':
        return MaterialPageRoute(builder: (_) => HousekeepingScreen());
      case '/requests':
        return MaterialPageRoute(builder: (_) => const MainScreen());
      case '/profile':
        return MaterialPageRoute(builder: (_) => const MainScreen());
      case '/cleaning-services':
        return MaterialPageRoute(builder: (_) => CleaningServicesScreen());
      case '/notifications':
        return MaterialPageRoute(builder: (_) => NotificationsScreen());
      case '/support':
        return MaterialPageRoute(builder: (_) => const MainScreen());
      case '/qr-scanner':
        return MaterialPageRoute(builder: (_) => const QRScannerScreen());
      case '/booking':
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) => BookingScreen(
            image: args?['image'] ?? 'assets/images/default_service.png',
            name: args?['name'] ?? 'Service',
            description: args?['description'] ?? 'Service description',
            price: args?['price'] ?? '0',
          ),
        );
      default:
        return MaterialPageRoute(builder: (_) => SplashScreen());
    }
  }
}
