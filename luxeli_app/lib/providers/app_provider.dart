import 'package:luxeli_app/features/get_started/providers/app_provider.dart';
import 'package:luxeli_app/features/get_started/providers/language_provider.dart';
import 'package:luxeli_app/features/get_started/providers/scanner_provider.dart';
import 'package:luxeli_app/features/home/providers/home_provider.dart';
import 'package:luxeli_app/features/housekeeping/providers/housekeeping_provider.dart';
import 'package:luxeli_app/features/notifications/providers/notification_provider.dart';
import 'package:luxeli_app/features/onboarding/providers/onboarding_provider.dart';
import 'package:luxeli_app/features/profile/providers/profile_provider.dart';
import 'package:luxeli_app/features/requests/providers/request_provider.dart';
import 'package:luxeli_app/features/splash/providers/splash_provider.dart';
import 'package:luxeli_app/features/cleaning_services/providers/cleaning_service_provider.dart';
import 'package:luxeli_app/features/bookings/providers/booking_provider.dart';
import 'package:provider/provider.dart';
import 'package:provider/single_child_widget.dart';
import '../core/constants/app_config.dart';
import 'app_state_provider.dart';

class AppMultiProvider {
  static List<SingleChildWidget> providers(AppConfig config) {
    return [
      ChangeNotifierProvider(create: (_) => SplashProvider()),
      ChangeNotifierProvider(create: (_) => LanguageProvider()),
      ChangeNotifierProvider(create: (_) => OnboardingProvider()),
      ChangeNotifierProvider(create: (_) => GetStartedScreenProvider()),
      ChangeNotifierProvider(create: (_) => ScannerProvider()),
      ChangeNotifierProvider(create: (_) => HomeProvider()),
      ChangeNotifierProvider(create: (_) => CleaningServiceProvider()),
      ChangeNotifierProvider(create: (_) => RequestProvider()),
      ChangeNotifierProvider(create: (_) => NotificationsProvider()),
      ChangeNotifierProvider(create: (_) => ProfileProvider()),
      ChangeNotifierProvider(create: (_) => HousekeepingProvider()),
      ChangeNotifierProvider(create: (_) => BookingProvider()),
      ChangeNotifierProvider(create: (_) => AppProvider(config)),
    ];
  }
}
