import 'package:flutter/material.dart';
import 'package:luxeli_app/features/housekeeping/models/housekeeping_model.dart';
import 'package:luxeli_app/features/housekeeping/services/housekeeping_service.dart';

class HousekeepingProvider with ChangeNotifier {
  final List<HousekeepingRequest> _requests = [];
  bool _isLoading = false;
  String? _token;

  List<HousekeepingRequest> get requests => [..._requests];
  bool get isLoading => _isLoading;

  // Set the user token for API authentication
  void setToken(String token) {
    _token = token;
  }

  // Load requests from the API
  Future<void> loadRequests() async {
    if (_token == null) return;

    _isLoading = true;
    notifyListeners();

    try {
      final response = await HousekeepingService.getMyRequests(token: _token!);

      if (response != null && response['success'] == true) {
        final List requestsData = response['data']['requests'];
        _requests.clear();

        for (var requestJson in requestsData) {
          _requests.add(
            HousekeepingRequest(
              id: requestJson['_id'],
              serviceType: requestJson['type'],
              requestTime: DateTime.parse(requestJson['createdAt']),
              status: _mapStatus(requestJson['status']),
              notes: requestJson['notes'],
            ),
          );
        }
      }
    } catch (e) {
      print('Error loading housekeeping requests: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Add a new request and sync with the API
  Future<bool> addRequest({
    required String type,
    required String requestedFor,
    String? cleaningType,
    int? itemQuantity,
    Map<String, dynamic>? deliveryDetail,
    String? priority,
    String? notes,
  }) async {
    if (_token == null) return false;

    try {
      final response = await HousekeepingService.createRequest(
        token: _token!,
        type: type,
        requestedFor: requestedFor,
        cleaningType: cleaningType,
        itemQuantity: itemQuantity,
        deliveryDetail: deliveryDetail,
        priority: priority,
        notes: notes,
      );

      if (response != null && response['success'] == true) {
        final requestJson = response['data']['request'];
        final newRequest = HousekeepingRequest(
          id: requestJson['_id'],
          serviceType: requestJson['type'],
          requestTime: DateTime.parse(requestJson['createdAt']),
          status: _mapStatus(requestJson['status']),
          notes: requestJson['notes'],
        );

        _requests.insert(0, newRequest); // Add to the beginning of the list
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      print('Error adding housekeeping request: $e');
      return false;
    }
  }

  void updateRequestStatus(String requestId, String newStatus) {
    final index = _requests.indexWhere((req) => req.id == requestId);
    if (index != -1) {
      _requests[index] = _requests[index].copyWith(status: newStatus);
      notifyListeners();
    }
  }

  /// Map backend status to frontend status
  String _mapStatus(String backendStatus) {
    switch (backendStatus) {
      case 'new':
        return 'Pending';
      case 'accepted':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'canceled':
        return 'Cancelled';
      case 'no-show':
        return 'No Show';
      default:
        return 'Pending';
    }
  }
}
