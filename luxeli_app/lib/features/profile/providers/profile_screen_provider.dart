import 'package:flutter/material.dart';

class ProfileScreenProvider with ChangeNotifier {
  String _selectedLanguage = 'English';

  String get selectedLanguage => _selectedLanguage;

  void setSelectedLanguage(String language) {
    _selectedLanguage = language;
    notifyListeners();
  }
}
