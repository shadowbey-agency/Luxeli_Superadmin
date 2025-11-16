import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:luxeli_app/core/constants/app_config.dart';

class ActivitiesService {
  static String get _baseUrl =>
      '${AppConfig.dev.apiUrl}/api/partner/activities';

  static Future<Map<String, dynamic>?> getActivities({
    required String token,
    int page = 1,
    int limit = 20,
    String? search,
    String? status,
  }) async {
    try {
      final queryParams = {
        'page': page.toString(),
        'limit': limit.toString(),
        if (search != null) 'search': search,
        if (status != null) 'status': status,
      };

      final url = Uri.parse(_baseUrl).replace(queryParameters: queryParams);
      final response = await http.get(
        url,
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error fetching activities: $e');
      return null;
    }
  }

  static Future<Map<String, dynamic>?> createActivity({
    required String token,
    required String activityTitle,
    required String activityDescription,
    String? activityImage,
    String? createdBy,
    String status = 'published',
  }) async {
    try {
      final url = Uri.parse(_baseUrl);
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'activityTitle': activityTitle,
          'activityDescription': activityDescription,
          if (activityImage != null) 'activityImage': activityImage,
          if (createdBy != null) 'createdBy': createdBy,
          'status': status,
        }),
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error creating activity: $e');
      return null;
    }
  }
}
