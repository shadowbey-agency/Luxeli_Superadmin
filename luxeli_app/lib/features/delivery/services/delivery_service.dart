import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:luxeli_app/core/constants/app_config.dart';

class DeliveryService {
  static String get _baseUrl =>
      '${AppConfig.dev.apiUrl}/api/partner/in-room-delivery-request';

  static Future<Map<String, dynamic>?> getMyRequests({
    required String token,
    int page = 1,
    int limit = 20,
    String? search,
    String? status,
    String? roomName,
    String? restaurant,
  }) async {
    try {
      final queryParams = {
        'page': page.toString(),
        'limit': limit.toString(),
        if (search != null && search.isNotEmpty) 'search': search,
        if (status != null && status.isNotEmpty) 'status': status,
        if (roomName != null && roomName.isNotEmpty) 'roomName': roomName,
        if (restaurant != null && restaurant.isNotEmpty)
          'restaurant': restaurant,
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
      print('Error fetching delivery requests: $e');
      return null;
    }
  }

  static Future<Map<String, dynamic>?> createRequest({
    required String token,
    required String roomName,
    required String residentialName,
    required List<String> items,
    required String restaurant,
    required String pickup,
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
          'roomName': roomName,
          'residentialName': residentialName,
          'items': items,
          'restaurant': restaurant,
          'pickup': pickup,
          if (notes != null) 'notes': notes,
        }),
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error creating delivery request: $e');
      return null;
    }
  }
}
