class AppConfig {
  final String appName;
  final String apiUrl;
  final bool debugMode;
  final String environment;

  AppConfig({
    required this.appName,
    required this.apiUrl,
    required this.debugMode,
    required this.environment,
  });

  static AppConfig get dev {
    return AppConfig(
      appName: 'Luxeli App - Development',
      // Use the actual IP address for device testing
      apiUrl:
          'http://192.168.18.26:3000', // Updated for local network connectivity
      debugMode: true,
      environment: 'development',
    );
  }

  static AppConfig get staging {
    return AppConfig(
      appName: 'Luxeli App - Staging',
      apiUrl: 'https://staging-api.luxeli.com',
      debugMode: true,
      environment: 'staging',
    );
  }

  static AppConfig get prod {
    return AppConfig(
      appName: 'Luxeli App',
      apiUrl: 'https://api.luxeli.com',
      debugMode: false,
      environment: 'production',
    );
  }
}
