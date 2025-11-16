import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  final String _baseUrl = 'http://localhost:3001/api';

  /// Authenticate user using QR code data
  Future<Map<String, dynamic>?> authenticateWithQR(String qrData) async {
    try {
      // Parse the QR data to extract required fields
      final parsedData = jsonDecode(qrData);

      final roomId = parsedData['roomId'];
      final partnerId = parsedData['partnerId'];
      final token = parsedData['token'];

      if (roomId == null || partnerId == null || token == null) {
        throw Exception('Missing required fields in QR data');
      }

      // Make API call to authenticate
      final response = await http.post(
        Uri.parse('$_baseUrl/user/login-qr'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'roomId': roomId,
          'partnerId': partnerId,
          'token': token,
        }),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        if (responseData['success'] == true) {
          return responseData;
        } else {
          throw Exception(responseData['message'] ?? 'Authentication failed');
        }
      } else {
        throw Exception(
          'Authentication failed with status: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw Exception('Failed to authenticate with QR code: $e');
    }
  }
}
