import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:luxeli_app/core/constants/app_config.dart';
import '../models/booking_model.dart' as booking_model;

typedef BookingModel = booking_model.Booking;

class BookingService {
  static String get _baseUrl => '${AppConfig.dev.apiUrl}/api/bookings/requests';
  static String get _internBaseUrl =>
      '${AppConfig.dev.apiUrl}/api/user/booking-intern-requests';
  static String get _servicesBaseUrl =>
      '${AppConfig.dev.apiUrl}/api/user/booking-services';

  static Future<Map<String, dynamic>?> getMyRequests({
    required String token,
  }) async {
    try {
      final url = Uri.parse('$_baseUrl/my');
      print('Fetching booking requests from: $url');
      print('Using token: $token');

      final response = await http.get(
        url,
        headers: {'Authorization': 'Bearer $token'},
      );

      print('Booking requests response status: ${response.statusCode}');
      print('Booking requests response body: ${response.body}');

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error fetching booking requests: $e');
      return null;
    }
  }

  static Future<Map<String, dynamic>?> getMyInternRequests({
    required String token,
  }) async {
    try {
      final url = Uri.parse(_internBaseUrl);
      print('Fetching booking intern requests from: $url');
      print('Using token: $token');

      final response = await http.get(
        url,
        headers: {'Authorization': 'Bearer $token'},
      );

      print('Booking intern requests response status: ${response.statusCode}');
      print('Booking intern requests response body: ${response.body}');

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error fetching booking intern requests: $e');
      return null;
    }
  }

  static Future<Map<String, dynamic>?> getAvailableServices({
    required String token,
  }) async {
    try {
      final url = Uri.parse(_servicesBaseUrl);
      print('Fetching available services from: $url');
      print('Using token: $token');

      final response = await http.get(
        url,
        headers: {'Authorization': 'Bearer $token'},
      );

      print('Available services response status: ${response.statusCode}');
      print('Available services response body: ${response.body}');

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error fetching available services: $e');
      return null;
    }
  }

  static Future<Map<String, dynamic>?> createBooking({
    required String token,
    required BookingModel booking,
  }) async {
    try {
      final url = Uri.parse(_baseUrl);
      print('Creating booking at: $url');

      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(booking.toJson()),
      );

      print('Create booking response status: ${response.statusCode}');
      print('Create booking response body: ${response.body}');

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error creating booking: $e');
      return null;
    }
  }

  static Future<Map<String, dynamic>?> createRequest({
    required String token,
    required String serviceId,
    required String serviceName,
    required String serviceImage,
    required String serviceDescription,
    required double price,
    required DateTime bookingDate,
    required String timeSlot,
    String? customerNotes,
  }) async {
    try {
      final url = Uri.parse(_baseUrl);
      print('Creating booking request at: $url');
      print(
        'Request data: serviceId=$serviceId, serviceName=$serviceName, price=$price, bookingDate=$bookingDate, timeSlot=$timeSlot',
      );

      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'serviceId': serviceId,
          'serviceName': serviceName,
          'serviceImage': serviceImage,
          'serviceDescription': serviceDescription,
          'price': price,
          'bookingDate': bookingDate.toIso8601String(),
          'timeSlot': timeSlot,
          if (customerNotes != null) 'customerNotes': customerNotes,
        }),
      );

      print('Create request response status: ${response.statusCode}');
      print('Create request response body: ${response.body}');

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error creating booking request: $e');
      return null;
    }
  }

  static Future<Map<String, dynamic>?> createInternRequest({
    required String token,
    required String category,
    required Map<String, String> reservation,
    String? notes,
  }) async {
    try {
      final url = Uri.parse(_internBaseUrl);
      print('Creating booking intern request at: $url');
      print('Request data: category=$category, reservation=$reservation');

      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'category': category,
          'reservation': reservation,
          if (notes != null) 'notes': notes,
        }),
      );

      print('Create intern request response status: ${response.statusCode}');
      print('Create intern request response body: ${response.body}');

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error creating booking intern request: $e');
      return null;
    }
  }

  static Future<Map<String, dynamic>?> cancelRequest({
    required String token,
    required String requestId,
  }) async {
    try {
      final url = Uri.parse('$_baseUrl/$requestId/cancel');
      print('Canceling booking request at: $url');

      final response = await http.patch(
        url,
        headers: {'Authorization': 'Bearer $token'},
      );

      print('Cancel request response status: ${response.statusCode}');
      print('Cancel request response body: ${response.body}');

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error canceling booking request: $e');
      return null;
    }
  }
}
