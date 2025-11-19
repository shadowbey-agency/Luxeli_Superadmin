import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:luxeli_app/core/constants/app_config.dart';

class HousekeepingItemsService {
  static String get _baseUrl => AppConfig.dev.apiUrl;

  /// Fetch housekeeping requests where type is "item needed"
  static Future<List<Map<String, dynamic>>?> getHousekeepingItems({
    required String token,
    String? category,
    int page = 1,
    int limit = 20,
  }) async {
    try {
      // Build query parameters
      final queryParams = {
        'page': page.toString(),
        'limit': limit.toString(),
        if (category != null && category != 'All') 'search': category,
      };

      // Use the housekeeping items endpoint (no auth required)
      final url = Uri.parse(
        '$_baseUrl/api/housekeeping-items',
      ).replace(queryParameters: queryParams);

      final response = await http.get(url);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          final List itemsData = data['data']['items'];
          return itemsData.cast<Map<String, dynamic>>();
        }
      }

      return null;
    } catch (e) {
      print('Error fetching housekeeping items: $e');
      return null;
    }
  }
}
