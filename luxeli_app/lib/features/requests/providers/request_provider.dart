import 'package:flutter/material.dart';
import 'package:luxeli_app/core/utils/app_logger.dart';
import '../models/request_model.dart';

class RequestProvider extends ChangeNotifier {
  List<RequestModel> _allRequests = [];
  List<RequestModel> _filteredRequests = [];
  RequestFilter _currentFilter = RequestFilter();
  bool _showFilterModal = false;
  bool _isLoading = false;
  String? _errorMessage;

  List<RequestModel> get requests => _filteredRequests;
  RequestFilter get currentFilter => _currentFilter;
  bool get showFilterModal => _showFilterModal;
  bool get hasRequests => _allRequests.isNotEmpty;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  List<RequestModel> get todayRequests =>
      _filteredRequests.where((r) => r.isToday).toList();

  List<RequestModel> get yesterdayRequests =>
      _filteredRequests.where((r) => !r.isToday).toList();

  RequestProvider() {
    _loadMockRequests();
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String? error) {
    _errorMessage = error;
    notifyListeners();
  }

  // Method to be implemented for real API integration
  Future<void> loadRequestsFromAPI() async {
    _setLoading(true);
    _setError(null);

    try {
      // This is where you would make an actual API call
      // For now, we'll keep using mock data
      await Future.delayed(
        Duration(milliseconds: 500),
      ); // Simulate network delay
      _loadMockRequests();
    } catch (e) {
      _setError('Failed to load requests. Please try again.');
      AppLogger.log('Error loading requests: $e');
    } finally {
      _setLoading(false);
    }
  }

  void _loadMockRequests() {
    _allRequests = [
      RequestModel(
        id: '15654',
        type: RequestType.housekeeping,
        status: RequestStatus.pending,
        date: DateTime(2025, 8, 15, 11, 0),
        requestTypeDetail: 'Custom cleaning',
        isToday: true,
      ),
      RequestModel(
        id: '15655',
        type: RequestType.laundry,
        status: RequestStatus.completed,
        date: DateTime(2025, 8, 15, 11, 0),
        service: 'Wash & Iron',
        itemCount: 3,
        isToday: true,
      ),
      RequestModel(
        id: '15656',
        type: RequestType.delivery,
        status: RequestStatus.completed,
        date: DateTime(2025, 8, 14, 11, 0),
        pickupLocation: 'Lunch',
        itemCount: 3,
        isToday: false,
      ),
    ];

    _filteredRequests = List.from(_allRequests);
    notifyListeners();
  }

  void setEmptyRequests() {
    _allRequests = [];
    _filteredRequests = [];
    notifyListeners();
  }

  void toggleFilterModal() {
    _showFilterModal = !_showFilterModal;
    notifyListeners();
  }

  void closeFilterModal() {
    _showFilterModal = false;
    notifyListeners();
  }

  void applyFilter(RequestFilter filter) {
    _currentFilter = filter;
    _filterRequests();
    _showFilterModal = false;
    notifyListeners();
  }

  void clearFilters() {
    _currentFilter = RequestFilter();
    _filterRequests();
    notifyListeners();
  }

  void _filterRequests() {
    _filteredRequests = _allRequests.where((request) {
      if (_currentFilter.serviceType != null &&
          request.type != _currentFilter.serviceType) {
        return false;
      }

      if (_currentFilter.status != null &&
          request.status != _currentFilter.status) {
        return false;
      }

      if (_currentFilter.date != null) {
        final filterDate = _currentFilter.date!;
        if (request.date.year != filterDate.year ||
            request.date.month != filterDate.month ||
            request.date.day != filterDate.day) {
          return false;
        }
      }

      return true;
    }).toList();
  }

  void cancelRequest(String requestId) {
    final index = _allRequests.indexWhere((r) => r.id == requestId);
    if (index != -1) {
      // In a real app, you would call an API here
      _allRequests.removeAt(index);
      _filterRequests();
      notifyListeners();
    }
  }

  void viewRequestDetails(String requestId) {
    // Navigate to request details screen
    AppLogger.log('View request details: $requestId');
  }

  // Method to add a new request (to be connected to API)
  Future<void> addRequest(RequestModel request) async {
    _setLoading(true);
    try {
      // In a real app, you would call an API here
      _allRequests.add(request);
      _filterRequests();
      notifyListeners();
    } catch (e) {
      _setError('Failed to add request. Please try again.');
      AppLogger.log('Error adding request: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Method to update a request (to be connected to API)
  Future<void> updateRequest(RequestModel updatedRequest) async {
    _setLoading(true);
    try {
      // In a real app, you would call an API here
      final index = _allRequests.indexWhere((r) => r.id == updatedRequest.id);
      if (index != -1) {
        _allRequests[index] = updatedRequest;
        _filterRequests();
        notifyListeners();
      }
    } catch (e) {
      _setError('Failed to update request. Please try again.');
      AppLogger.log('Error updating request: $e');
    } finally {
      _setLoading(false);
    }
  }
}
