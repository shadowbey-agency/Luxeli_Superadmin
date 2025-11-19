import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../constants/app_config.dart';
import '../utils/network_utils.dart';

class NetworkService {
  final AppConfig config;

  NetworkService(this.config);

  /// Sends a GET request to the specified endpoint
  Future<http.Response> get(
    String endpoint, {
    Map<String, String>? headers,
  }) async {
    final url = NetworkUtils.getApiUrl(config, endpoint);
    try {
      if (kDebugMode) {
        print('GET Request to: $url');
        if (headers != null) {
          print('Headers: $headers');
        }
      }

      final response = await http
          .get(Uri.parse(url), headers: headers)
          .timeout(Duration(seconds: 30));

      if (kDebugMode) {
        print('Response Status: ${response.statusCode}');
        print('Response Body: ${response.body}');
      }

      return response;
    } on SocketException catch (e) {
      if (kDebugMode) {
        print('Socket Exception: $e');
      }
      throw NetworkException('No internet connection');
    } on TimeoutException catch (e) {
      if (kDebugMode) {
        print('Timeout Exception: $e');
      }
      throw NetworkException('Request timeout');
    } catch (e) {
      if (kDebugMode) {
        print('Network Error: $e');
      }
      throw NetworkException('Network error occurred');
    }
  }

  /// Sends a POST request to the specified endpoint
  Future<http.Response> post(
    String endpoint, {
    Object? body,
    Map<String, String>? headers,
  }) async {
    final url = NetworkUtils.getApiUrl(config, endpoint);
    try {
      if (kDebugMode) {
        print('POST Request to: $url');
        print('Body: $body');
        if (headers != null) {
          print('Headers: $headers');
        }
      }

      final response = await http
          .post(
            Uri.parse(url),
            headers: headers,
            body: body is String ? body : jsonEncode(body),
          )
          .timeout(Duration(seconds: 30));

      if (kDebugMode) {
        print('Response Status: ${response.statusCode}');
        print('Response Body: ${response.body}');
      }

      return response;
    } on SocketException catch (e) {
      if (kDebugMode) {
        print('Socket Exception: $e');
      }
      throw NetworkException('No internet connection');
    } on TimeoutException catch (e) {
      if (kDebugMode) {
        print('Timeout Exception: $e');
      }
      throw NetworkException('Request timeout');
    } catch (e) {
      if (kDebugMode) {
        print('Network Error: $e');
      }
      throw NetworkException('Network error occurred');
    }
  }

  /// Sends a PUT request to the specified endpoint
  Future<http.Response> put(
    String endpoint, {
    Object? body,
    Map<String, String>? headers,
  }) async {
    final url = NetworkUtils.getApiUrl(config, endpoint);
    try {
      if (kDebugMode) {
        print('PUT Request to: $url');
        print('Body: $body');
        if (headers != null) {
          print('Headers: $headers');
        }
      }

      final response = await http
          .put(
            Uri.parse(url),
            headers: headers,
            body: body is String ? body : jsonEncode(body),
          )
          .timeout(Duration(seconds: 30));

      if (kDebugMode) {
        print('Response Status: ${response.statusCode}');
        print('Response Body: ${response.body}');
      }

      return response;
    } on SocketException catch (e) {
      if (kDebugMode) {
        print('Socket Exception: $e');
      }
      throw NetworkException('No internet connection');
    } on TimeoutException catch (e) {
      if (kDebugMode) {
        print('Timeout Exception: $e');
      }
      throw NetworkException('Request timeout');
    } catch (e) {
      if (kDebugMode) {
        print('Network Error: $e');
      }
      throw NetworkException('Network error occurred');
    }
  }

  /// Sends a DELETE request to the specified endpoint
  Future<http.Response> delete(
    String endpoint, {
    Map<String, String>? headers,
  }) async {
    final url = NetworkUtils.getApiUrl(config, endpoint);
    try {
      if (kDebugMode) {
        print('DELETE Request to: $url');
        if (headers != null) {
          print('Headers: $headers');
        }
      }

      final response = await http
          .delete(Uri.parse(url), headers: headers)
          .timeout(Duration(seconds: 30));

      if (kDebugMode) {
        print('Response Status: ${response.statusCode}');
        print('Response Body: ${response.body}');
      }

      return response;
    } on SocketException catch (e) {
      if (kDebugMode) {
        print('Socket Exception: $e');
      }
      throw NetworkException('No internet connection');
    } on TimeoutException catch (e) {
      if (kDebugMode) {
        print('Timeout Exception: $e');
      }
      throw NetworkException('Request timeout');
    } catch (e) {
      if (kDebugMode) {
        print('Network Error: $e');
      }
      throw NetworkException('Network error occurred');
    }
  }
}

class NetworkException implements Exception {
  final String message;

  NetworkException(this.message);

  @override
  String toString() => 'NetworkException: $message';
}
