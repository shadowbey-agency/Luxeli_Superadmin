import 'package:flutter/material.dart';

class SplashProvider with ChangeNotifier {
  bool _isLoading = true;
  bool get isLoading => _isLoading;

  Future<void> initializeApp() async {
    // Simulate app initialization
    await Future.delayed(Duration(seconds: 3));
    
    _isLoading = false;
    notifyListeners();
  }
}