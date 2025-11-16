import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:luxeli_app/core/constants/app_config.dart';

class HousekeepingService {
  static String get _baseUrl =>
      '${AppConfig.dev.apiUrl}/api/housekeeping-requests';
  static Future<Map<String, dynamic>?> createRequest({
    required String token,
    required String type,
    required String requestedFor,
    String? cleaningType,
    int? itemQuantity,
    Map<String, dynamic>? deliveryDetail,
    String? priority,
    String? notes,
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
          'type': type,
          'requestedFor': requestedFor,
          if (cleaningType != null) 'cleaningType': cleaningType,
          if (itemQuantity != null) 'itemQuantity': itemQuantity,
          if (deliveryDetail != null) 'deliveryDetail': deliveryDetail,
          if (priority != null) 'priority': priority,
          if (notes != null) 'notes': notes,
        }),
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error creating housekeeping request: $e');
      return null;
    }
  }

  static Future<Map<String, dynamic>?> getMyRequests({
    required String token,
  }) async {
    try {
      final url = Uri.parse('$_baseUrl/my');
      final response = await http.get(
        url,
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error fetching housekeeping requests: $e');
      return null;
    }
  }

  static Future<Map<String, dynamic>?> getPartnerRequests({
    required String token,
    String? search,
    String? status,
    String? type,
    String? priority,
    String? roomId,
    int page = 1,
    int limit = 20,
  }) async {
    try {
      final queryParams = {
        'page': page.toString(),
        'limit': limit.toString(),
        if (search != null) 'search': search,
        if (status != null) 'status': status,
        if (type != null) 'type': type,
        if (priority != null) 'priority': priority,
        if (roomId != null) 'roomId': roomId,
      };

      final url = Uri.parse(
        '${AppConfig.dev.apiUrl}/api/partner/housekeeping-requests',
      ).replace(queryParameters: queryParams);

      final response = await http.get(
        url,
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error fetching partner housekeeping requests: $e');
      return null;
    }
  }
}
