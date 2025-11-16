import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:luxeli_app/core/models/guest_model.dart';
import 'package:luxeli_app/core/constants/app_config.dart';

class QRLoginService {
  static final String baseUrl =
      AppConfig.dev.apiUrl; // Use the app config base URL

  /// Login with QR code token
  static Future<GuestData?> loginWithQR(String token) async {
    // Log the token being sent for debugging
    print('QR Login Service - Token length: ${token.length}');
    final previewLength = token.length < 50 ? token.length : 50;
    print(
      'QR Login Service - Token preview: ${token.substring(0, previewLength)}',
    );
    print('QR Login Service - Base URL: $baseUrl');

    // Validate that we have a proper token
    if (token.isEmpty) {
      throw Exception('Empty token provided');
    }

    // Validate token format (JWT should have 3 parts separated by dots)
    final parts = token.split('.');
    if (parts.length != 3) {
      throw Exception(
        'Invalid token format. Token must be a valid JWT with 3 parts.',
      );
    }

    // Check if parts are empty
    for (int i = 0; i < parts.length; i++) {
      if (parts[i].isEmpty) {
        throw Exception('Invalid token format. Part $i of the token is empty.');
      }
    }

    // Retry mechanism for network issues
    int maxRetries = 3;
    int retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        final Uri url = Uri.parse('$baseUrl/api/user/login-qr');
        print('Making request to: $url');

        // Create the request body
        final requestBody = {'token': token};
        final jsonString = jsonEncode(requestBody);
        print('Request body JSON: $jsonString');
        print('Request body length: ${jsonString.length}');

        final response = await http
            .post(
              url,
              headers: {'Content-Type': 'application/json'},
              body: jsonString,
            )
            .timeout(Duration(seconds: 10)); // Add timeout

        print('Response status: ${response.statusCode}');
        print('Response body: ${response.body}');

        if (response.statusCode == 200) {
          final Map<String, dynamic> data = jsonDecode(response.body);

          if (data['success'] == true) {
            final guestData = GuestData.fromJson(data['data']);

            // Print complete guest data to console
            print('=== Guest Data ===');
            print('User ID: ${guestData.userId}');
            print('Partner ID: ${guestData.partnerId}');
            print('Room ID: ${guestData.roomId}');
            print('Room Name: ${guestData.roomName}');
            print('Guest Name: ${guestData.guestName}');
            print('Guest Email: ${guestData.guestEmail ?? "Not provided"}');
            print('Guest Phone: ${guestData.guestPhone ?? "Not provided"}');
            print('Token: ${guestData.token}');
            print('==================');

            return guestData;
          } else {
            throw Exception(data['error'] ?? 'Login failed');
          }
        } else if (response.statusCode == 400) {
          // Handle bad request - likely JSON parsing error on server
          final responseBody = response.body;
          print('Bad request response: $responseBody');
          throw Exception(
            'Invalid request format. Please try scanning the QR code again.',
          );
        } else if (response.statusCode == 401) {
          throw Exception(
            'Invalid or expired QR code. Please get a new QR code from the front desk.',
          );
        } else if (response.statusCode == 403) {
          throw Exception(
            'Access denied. This QR code is not valid for guest access.',
          );
        } else if (response.statusCode == 404) {
          throw Exception('Guest record not found. Please contact front desk.');
        } else if (response.statusCode == 500) {
          throw Exception('Server error. Please try again later.');
        } else {
          throw Exception(
            'Failed to login. Status code: ${response.statusCode}',
          );
        }
      } catch (e) {
        print('QR Login Error (attempt ${retryCount + 1}): $e');

        // If this is the last retry, rethrow the error
        if (retryCount == maxRetries - 1) {
          // Check if it's a network error and provide a more helpful message
          final errorMessage = e.toString();
          if (errorMessage.contains('Connection refused') ||
              errorMessage.contains('SocketException')) {
            throw Exception(
              'Unable to connect to server. Please make sure you are connected to the same WiFi network as the server and try again.',
            );
          }
          rethrow;
        }

        // Wait before retrying
        await Future.delayed(Duration(seconds: 2));
        retryCount++;
      }
    }

    return null; // This should never be reached
  }
}
