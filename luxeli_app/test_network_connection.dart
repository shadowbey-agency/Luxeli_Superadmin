import 'dart:io';
import 'dart:convert';
import 'lib/core/constants/app_config.dart';
import 'lib/core/utils/network_utils.dart';

void main() async {
  // Test the development configuration
  final config = AppConfig.dev;
  print('Testing network configuration:');
  print('API URL: ${config.apiUrl}');
  print('Environment: ${config.environment}');

  // Test building a URL
  final testEndpoint = '/api/test';
  final fullUrl = NetworkUtils.buildUrl(config, testEndpoint);
  print('Full URL: $fullUrl');

  // Test network connectivity
  try {
    print('Testing connectivity to backend...');
    final uri = Uri.parse(config.apiUrl);
    final httpClient = HttpClient();
    final request = await httpClient.getUrl(uri);
    final response = await request.close();

    print('Connection successful!');
    print('Status code: ${response.statusCode}');

    // Read response
    final responseBody = await response.transform(utf8.decoder).join();
    print('Response body: $responseBody');

    httpClient.close();
  } catch (e) {
    print('Connection failed: $e');
  }

  // Test internet connectivity
  try {
    print('Testing general internet connectivity...');
    final result = await InternetAddress.lookup(
      'google.com',
    ).timeout(Duration(seconds: 5));

    if (result.isNotEmpty && result[0].rawAddress.isNotEmpty) {
      print('Internet connection: Available');
    } else {
      print('Internet connection: Unavailable');
    }
  } catch (e) {
    print('Internet connection test failed: $e');
  }
}
