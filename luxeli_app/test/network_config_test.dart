import 'package:flutter_test/flutter_test.dart';
import 'package:luxeli_app/core/constants/app_config.dart';
import 'package:luxeli_app/core/utils/network_utils.dart';
import 'package:luxeli_app/providers/app_state_provider.dart';

void main() {
  group('Network Configuration Tests', () {
    test('AppConfig development environment has correct URL', () {
      final config = AppConfig.dev;
      expect(config.apiUrl, 'http://192.168.18.26:3000');
      expect(config.environment, 'development');
      expect(config.debugMode, true);
    });

    test('NetworkUtils builds correct URLs', () {
      final config = AppConfig.dev;
      final url = NetworkUtils.buildUrl(config, '/api/test');
      expect(url, 'http://192.168.18.26:3000/api/test');
    });

    test('AppProvider provides correct configuration', () {
      final config = AppConfig.dev;
      final provider = AppProvider(config);

      expect(provider.config, config);
      expect(provider.apiUrl, config.apiUrl);
      expect(provider.environment, config.environment);
      expect(provider.debugMode, config.debugMode);
    });

    test('AppProvider builds API URLs correctly', () {
      final config = AppConfig.dev;
      final provider = AppProvider(config);

      final url = provider.buildApiUrl('/api/users');
      expect(url, 'http://192.168.18.26:3000/api/users');
    });
  });
}
