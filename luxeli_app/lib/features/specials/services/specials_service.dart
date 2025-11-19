import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:luxeli_app/core/constants/app_config.dart';

class SpecialsService {
  static String get _baseUrl =>
      '${AppConfig.dev.apiUrl}/api/user/customized-service-requests';

  static Future<Map<String, dynamic>?> getMyCustomizedServiceRequests({
    required String token,
  }) async {
    try {
      final response = await http.get(
        Uri.parse(_baseUrl),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        return {
          'success': false,
          'message': 'Failed to load requests: ${response.statusCode}',
        };
      }
    } catch (error) {
      return {'success': false, 'message': 'Network error: $error'};
    }
  }

  static Future<Map<String, dynamic>?> createCustomizedServiceRequest({
    required String token,
    required String title,
    String? description,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(_baseUrl),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'title': title, 'description': description}),
      );

      if (response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        return {
          'success': false,
          'message': 'Failed to create request: ${response.statusCode}',
        };
      }
    } catch (error) {
      return {'success': false, 'message': 'Network error: $error'};
    }
  }
}
