import 'package:flutter/material.dart';
import 'package:luxeli_app/features/laundry/models/laundry_request.dart';
import 'package:luxeli_app/features/laundry/services/laundry_service.dart';

class LaundryProvider with ChangeNotifier {
  final List<LaundryRequest> _requests = [];
  bool _isLoading = false;
  String? _token;
  String? _errorMessage;

  List<LaundryRequest> get requests => [..._requests];
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  // Set the user token for API authentication
  void setToken(String token) {
    _token = token;
  }

  // Load requests from the API
  Future<void> loadRequests() async {
    if (_token == null) return;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await LaundryService.getMyRequests(token: _token!);

      // Debug information
      print('Laundry API Response: $response');

      if (response != null && response['success'] == true) {
        final List requestsData = response['data']['requests'];
        print('Number of requests fetched: ${requestsData.length}');

        _requests.clear();

        for (var requestJson in requestsData) {
          print('Request data: $requestJson');
          try {
            final request = LaundryRequest.fromJson(requestJson);
            _requests.add(request);
            print('Successfully parsed request: ${request.id}');
          } catch (e) {
            print('Error parsing individual request: $e');
          }
        }

        print('Total requests after parsing: ${_requests.length}');
      } else {
        print('API response was not successful or null');
        _errorMessage = 'Failed to load requests';
      }
    } catch (e) {
      print('Error loading laundry requests: $e');
      _errorMessage = 'Failed to load requests: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Add a new request and sync with the API
  Future<bool> addRequest({
    required String residentialName,
    required List<String> services,
    required int piece,
    required DateTime pickup,
    String? priority,
    String? notes,
  }) async {
    if (_token == null) return false;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await LaundryService.createRequest(
        token: _token!,
        residentialName: residentialName,
        services: services,
        piece: piece,
        pickup: pickup,
        priority: priority,
        notes: notes,
      );

      if (response != null && response['success'] == true) {
        final requestJson = response['data']['request'];
        final newRequest = LaundryRequest.fromJson(requestJson);
        print('Successfully created request: $requestJson');

        _requests.insert(0, newRequest); // Add to the beginning of the list
        _isLoading = false;
        notifyListeners();

        // Reload all requests to ensure consistency with backend
        await loadRequests();

        return true;
      } else {
        _errorMessage =
            response?['message'] ?? 'Failed to create laundry request';
        print('Error creating request: $_errorMessage');
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = 'Error adding laundry request: $e';
      print('Error adding laundry request: $e');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}
