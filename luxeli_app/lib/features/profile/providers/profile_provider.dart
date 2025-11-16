import 'package:flutter/material.dart';

class ProfileProvider extends ChangeNotifier {
  bool _notificationsEnabled = true;

  bool get notificationsEnabled => _notificationsEnabled;

  void toggleNotifications(bool newValue) {
    _notificationsEnabled = newValue;
    notifyListeners();
  }
}
