import 'package:flutter/material.dart';
import 'package:luxeli_app/features/activities/models/activity_model.dart';
import 'package:luxeli_app/features/activities/services/activities_service.dart';

class ActivitiesProvider with ChangeNotifier {
  final List<Activity> _activities = [];
  bool _isLoading = false;
  String? _token;

  List<Activity> get activities => [..._activities];
  bool get isLoading => _isLoading;

  // Set the user token for API authentication
  void setToken(String token) {
    _token = token;
  }

  // Load activities from the API
  Future<void> loadActivities() async {
    if (_token == null) return;

    _isLoading = true;
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
      }
    } catch (e) {
      print('Error loading activities: $e');
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
      }
      return false;
    } catch (e) {
      print('Error adding activity: $e');
      return false;
    }
  }
}
