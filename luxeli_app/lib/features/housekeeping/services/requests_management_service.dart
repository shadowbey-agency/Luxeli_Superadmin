import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:luxeli_app/core/constants/app_config.dart';

class RequestsManagementService {
  static String get _baseUrl => AppConfig.dev.apiUrl;

  /// Fetch all requests management items
  static Future<List<Map<String, dynamic>>?> getRequestsManagementItems({
    required String token,
    String? search,
    String? status,
    String? category,
    int page = 1,
    int limit = 20,
  }) async {
    try {
      // Build query parameters
      final queryParams = {
        'page': page.toString(),
        'limit': limit.toString(),
        if (search != null && search.isNotEmpty) 'search': search,
        if (status != null && status.isNotEmpty) 'status': status,
        if (category != null && category.isNotEmpty) 'category': category,
      };

      // Use the requests management endpoint
      final url = Uri.parse(
        '$_baseUrl/api/partner/requests-management',
      ).replace(queryParameters: queryParams);

      final response = await http.get(
        url,
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          final List itemsData = data['data']['requests'];
          return itemsData.cast<Map<String, dynamic>>();
        }
      }

      return null;
    } catch (e) {
      print('Error fetching requests management items: $e');
      return null;
    }
  }
}
