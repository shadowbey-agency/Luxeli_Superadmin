import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/profile_data_model.dart';

class ProfileApiService {
  static const String baseUrl =
      'https://api.example.com'; // Replace with actual base URL

  /// Fetch profile data from API
  static Future<ProfileData?> fetchProfileData(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/profile'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        return ProfileData.fromJson(data);
      } else {
        throw Exception('Failed to load profile data: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching profile data: $e');
      return null;
    }
  }

  /// Update profile data
  static Future<bool> updateProfileData(
    String token,
    ProfileData profileData,
  ) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/profile'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode(profileData.toJson()),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error updating profile data: $e');
      return false;
    }
  }

  /// Update language preference
  static Future<bool> updateLanguage(String token, String language) async {
    try {
      final response = await http.patch(
        Uri.parse('$baseUrl/profile/language'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'language': language}),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error updating language: $e');
      return false;
    }
  }
}
