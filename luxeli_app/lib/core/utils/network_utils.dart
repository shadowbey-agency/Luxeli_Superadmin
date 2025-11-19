import 'dart:io';
import 'package:flutter/foundation.dart';
import '../constants/app_config.dart';

class NetworkUtils {
  /// Returns the base URL for API calls based on the current environment
  static String getBaseUrl(AppConfig config) {
    return config.apiUrl;
  }

  /// Checks if the device has internet connectivity
  static Future<bool> hasInternetConnection() async {
    try {
      final result = await InternetAddress.lookup(
        'google.com',
      ).timeout(Duration(seconds: 5));
      return result.isNotEmpty && result[0].rawAddress.isNotEmpty;
    } on SocketException catch (_) {
      return false;
    } on Exception catch (_) {
      return false;
    }
  }

  /// Builds a complete URL by combining the base URL with an endpoint
  static String buildUrl(AppConfig config, String endpoint) {
    final baseUrl = getBaseUrl(config);
    // Ensure endpoint starts with a forward slash
    if (!endpoint.startsWith('/')) {
      endpoint = '/$endpoint';
    }

    // Remove trailing slash from baseUrl if present
    final cleanBaseUrl = baseUrl.endsWith('/')
        ? baseUrl.substring(0, baseUrl.length - 1)
        : baseUrl;

    return '$cleanBaseUrl$endpoint';
  }

  /// Returns the appropriate API URL for the current environment
  static String getApiUrl(AppConfig config, String endpoint) {
    if (kDebugMode) {
      print('Making API call to: ${buildUrl(config, endpoint)}');
    }
    return buildUrl(config, endpoint);
  }
}
