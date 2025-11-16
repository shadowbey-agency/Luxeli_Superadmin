import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:luxeli_app/core/constants/app_config.dart';
import 'package:luxeli_app/features/housekeeping/models/housekeeping_item_model.dart';

class HousekeepingItemsService {
  static String get _baseUrl =>
      '${AppConfig.dev.apiUrl}/api/partner/housekeeping-items';

  /// Fetch housekeeping items with images
  static Future<List<HousekeepingItem>?> getHousekeepingItems({
    required String token,
    String? category,
    int page = 1,
    int limit = 20,
  }) async {
    try {
      final queryParams = {
        'page': page.toString(),
        'limit': limit.toString(),
        if (category != null) 'category': category,
      };

      final url = Uri.parse(_baseUrl).replace(queryParameters: queryParams);

      final response = await http.get(
        url,
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          final List itemsData = data['data']['items'];
          return itemsData
              .map((item) => HousekeepingItem.fromJson(item))
              .toList();
        }
      }
      return null;
    } catch (e) {
      print('Error fetching housekeeping items: $e');
      return null;
    }
  }
}
