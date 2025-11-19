import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:luxeli_app/core/constants/app_config.dart';

class RestaurantService {
  static String get _baseUrl => AppConfig.dev.apiUrl;

  /// Fetch all published restaurants for partners
  static Future<Map<String, dynamic>?> getRestaurants({
    String? token,
    int page = 1,
    int limit = 20,
    String? search,
    String? status,
  }) async {
    try {
      final queryParams = {
        'page': page.toString(),
        'limit': limit.toString(),
        if (search != null && search.isNotEmpty) 'search': search,
        if (status != null && status.isNotEmpty) 'status': status,
      };

      // Use the correct endpoint: /api/partner/restaurants instead of /api/partner/room-delivery/restaurants
      final url = Uri.parse(
        '$_baseUrl/api/partner/restaurants',
      ).replace(queryParameters: queryParams);

      final Map<String, String> headers = {'Content-Type': 'application/json'};

      // Add authorization header if token is provided
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }

      final response = await http.get(url, headers: headers);

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error fetching restaurants: $e');
      return null;
    }
  }

  /// Create a new restaurant (partner only)
  static Future<Map<String, dynamic>?> createRestaurant({
    required String token,
    required String restaurantName,
    required String status,
    required String startWork,
    required String endWork,
    String? restaurantImage,
    List<Map<String, dynamic>>? items,
  }) async {
    try {
      final url = Uri.parse('$_baseUrl/api/partner/restaurants');

      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'restaurantName': restaurantName,
          'status': status,
          'startWork': startWork,
          'endWork': endWork,
          if (restaurantImage != null) 'restaurantImage': restaurantImage,
          if (items != null) 'items': items,
        }),
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error creating restaurant: $e');
      return null;
    }
  }
}
