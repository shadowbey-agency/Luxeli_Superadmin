import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:luxeli_app/core/constants/app_config.dart';

class LaundryService {
  static String get _baseUrl => '${AppConfig.dev.apiUrl}/api/laundry/requests';

  static Future<Map<String, dynamic>?> getMyRequests({
    required String token,
  }) async {
    try {
      final url = Uri.parse('$_baseUrl/my');
      print('Fetching laundry requests from: $url');
      print('Using token: $token');

      final response = await http.get(
        url,
        headers: {'Authorization': 'Bearer $token'},
      );

      print('Laundry requests response status: ${response.statusCode}');
      print('Laundry requests response body: ${response.body}');

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error fetching laundry requests: $e');
      return null;
    }
  }

  static Future<Map<String, dynamic>?> createRequest({
    required String token,
    required String residentialName,
    required List<String> services,
    required int piece,
    required DateTime pickup,
    String? priority,
    String? notes,
  }) async {
    try {
      final url = Uri.parse(_baseUrl);
      print('Creating laundry request at: $url');
      print(
        'Request data: residentialName=$residentialName, services=$services, piece=$piece, pickup=$pickup, priority=$priority, notes=$notes',
      );

      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'residentialName': residentialName,
          'services': services,
          'piece': piece,
          'pickup': pickup.toIso8601String(),
          if (priority != null) 'priority': priority,
          if (notes != null) 'notes': notes,
        }),
      );

      print('Create request response status: ${response.statusCode}');
      print('Create request response body: ${response.body}');

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error creating laundry request: $e');
      return null;
    }
  }
}
