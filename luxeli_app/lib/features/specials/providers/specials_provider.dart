import 'package:flutter/material.dart';
import 'package:luxeli_app/features/specials/models/customized_service_request.dart';
import 'package:luxeli_app/features/specials/services/specials_service.dart';

class SpecialsProvider with ChangeNotifier {
  List<CustomizedServiceRequest> _requests = [];
  bool _isLoading = false;
  String? _token;
  String? _errorMessage;

  List<CustomizedServiceRequest> get requests => [..._requests];
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  // Set the user token for API authentication
  void setToken(String token) {
    _token = token;
  }

  // Load customized service requests from the API
  Future<void> loadRequests() async {
    if (_token == null) return;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await SpecialsService.getMyCustomizedServiceRequests(
        token: _token!,
      );

      if (response != null && response['success'] == true) {
        final List<dynamic> requestsData = response['data']['requests'];
        _requests = requestsData
            .map(
              (item) => CustomizedServiceRequest.fromJson(
                item as Map<String, dynamic>,
              ),
            )
            .toList();
      } else {
        _errorMessage = response?['message'] ?? 'Failed to load requests';
      }
    } catch (error) {
      _errorMessage = 'Error loading requests: $error';
      print('Error loading requests: $error');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Create a new customized service request
  Future<bool> createRequest({
    required String title,
    String? description,
  }) async {
    if (_token == null) return false;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final result = await SpecialsService.createCustomizedServiceRequest(
        token: _token!,
        title: title,
        description: description,
      );

      if (result != null && result['success'] == true) {
        // Add the new request to our list
        final newRequest = CustomizedServiceRequest.fromJson(
          result['data']['request'],
        );
        _requests.insert(0, newRequest);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = result?['message'] ?? 'Failed to create request';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (error) {
      _errorMessage = 'Error creating request: $error';
      print('Error creating request: $error');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}
