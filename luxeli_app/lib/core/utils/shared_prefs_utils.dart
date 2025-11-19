import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:luxeli_app/core/models/guest_model.dart';

class SharedPrefsUtils {
  static const String _guestDataKey = 'guest_data';
  static const String _isLoggedInKey = 'is_logged_in';

  /// Save guest data to shared preferences
  static Future<bool> saveGuestData(GuestData guestData) async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();

      // Convert guest data to JSON string
      final String guestDataJson = jsonEncode(guestData.toJson());

      // Save the data and login status
      await prefs.setString(_guestDataKey, guestDataJson);
      await prefs.setBool(_isLoggedInKey, true);

      return true;
    } catch (e) {
      print('Error saving guest data to shared preferences: $e');
      return false;
    }
  }

  /// Load guest data from shared preferences
  static Future<GuestData?> loadGuestData() async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();

      // Check if user is logged in
      final bool isLoggedIn = prefs.getBool(_isLoggedInKey) ?? false;
      if (!isLoggedIn) {
        return null;
      }

      // Get guest data JSON string
      final String? guestDataJson = prefs.getString(_guestDataKey);
      if (guestDataJson == null || guestDataJson.isEmpty) {
        return null;
      }

      // Parse JSON and create GuestData object
      final Map<String, dynamic> guestDataMap = jsonDecode(guestDataJson);
      return GuestData.fromJson(guestDataMap);
    } catch (e) {
      print('Error loading guest data from shared preferences: $e');
      return null;
    }
  }

  /// Check if user is logged in
  static Future<bool> isLoggedIn() async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      return prefs.getBool(_isLoggedInKey) ?? false;
    } catch (e) {
      print('Error checking login status: $e');
      return false;
    }
  }

  /// Clear guest data from shared preferences
  static Future<bool> clearGuestData() async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.remove(_guestDataKey);
      await prefs.remove(_isLoggedInKey);
      return true;
    } catch (e) {
      print('Error clearing guest data from shared preferences: $e');
      return false;
    }
  }
}
