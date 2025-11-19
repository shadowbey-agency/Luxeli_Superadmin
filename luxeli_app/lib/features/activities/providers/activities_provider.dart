import 'package:flutter/material.dart';
import 'package:luxeli_app/features/activities/models/activity_model.dart';
import 'package:luxeli_app/features/activities/services/activities_service.dart';

class ActivitiesProvider with ChangeNotifier {
  final List<Activity> _activities = [];
  bool _isLoading = false;
  String? _token;
  String? _errorMessage; // Add error message field

  List<Activity> get activities => [..._activities];
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage; // Add error message getter

  // Set the user token for API authentication
  void setToken(String token) {
    _token = token;
  }

  // Alias for loadActivities to match UI expectations
  Future<void> fetchActivities() async {
    await loadActivities();
  }

  // Load activities from the API
  Future<void> loadActivities() async {
    if (_token == null) return;

    _isLoading = true;
    _errorMessage = null; // Clear previous error
    notifyListeners();

    try {
      final response = await ActivitiesService.getActivities(
        token: _token!,
        status: 'published', // Only load published activities
      );

      if (response != null && response['success'] == true) {
        final List activitiesData = response['data']['activities'];
        _activities.clear();

        for (var activityJson in activitiesData) {
          _activities.add(Activity.fromJson(activityJson));
        }
      } else {
        _errorMessage = response?['error'] ?? 'Failed to load activities';
      }
    } catch (e) {
      _errorMessage = 'Error loading activities: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Add a new activity and sync with the API
  Future<bool> addActivity({
    required String activityTitle,
    required String activityDescription,
    String? activityImage,
    String? createdBy,
  }) async {
    if (_token == null) return false;

    _isLoading = true;
    _errorMessage = null; // Clear previous error
    notifyListeners();

    try {
      final response = await ActivitiesService.createActivity(
        token: _token!,
        activityTitle: activityTitle,
        activityDescription: activityDescription,
        activityImage: activityImage,
        createdBy: createdBy,
      );

      if (response != null && response['success'] == true) {
        final activityJson = response['data']['activity'];
        final newActivity = Activity.fromJson(activityJson);

        _activities.insert(0, newActivity); // Add to the beginning of the list
        notifyListeners();
        return true;
      } else {
        _errorMessage = response?['error'] ?? 'Failed to create activity';
        return false;
      }
    } catch (e) {
      _errorMessage = 'Error adding activity: $e';
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Create an activity request
  Future<bool> createActivityRequest({
    required String activityId,
    required String guestNotes,
    required DateTime preferredDate,
    required String token,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      // Create the activity request by calling the API
      final response = await ActivitiesService.createActivityRequest(
        token: token,
        service: guestNotes, // Using guestNotes as the service name
        notes: guestNotes, // Using guestNotes as the notes
      );

      if (response != null && response['success'] == true) {
        notifyListeners();
        return true;
      } else {
        _errorMessage =
            response?['error'] ?? 'Failed to create activity request';
        return false;
      }
    } catch (e) {
      _errorMessage = 'Error creating activity request: $e';
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Load user's own activity requests (new method)
  Future<void> loadRequests() async {
    if (_token == null) return;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ActivitiesService.getMyRequests(token: _token!);

      // Note: For activities, we're using the same activities list for now
      // In a real implementation, this would populate a separate requests list
      if (response != null && response['success'] == true) {
        // Handle the response if needed
        print('Successfully loaded activity requests');
      } else {
        _errorMessage =
            response?['error'] ?? 'Failed to load activity requests';
      }
    } catch (e) {
      _errorMessage = 'Error loading activity requests: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
