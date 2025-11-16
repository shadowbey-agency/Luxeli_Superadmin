import 'package:flutter/material.dart';
import 'package:luxeli_app/features/get_started/model/app_state_model.dart';

class GetStartedScreenProvider extends ChangeNotifier {
  AppStateModel _state = AppStateModel();

  AppStateModel get state => _state;
  AppScreen get currentScreen => _state.currentScreen;
  bool get isConnecting => _state.isConnecting;
  bool get isScanning => _state.isScanning;
  String? get scannedData => _state.scannedData;

  void navigateToConnection() {
    _state = _state.copyWith(currentScreen: AppScreen.connection);
    notifyListeners();
  }

  void navigateToScanner() {
    _state = _state.copyWith(currentScreen: AppScreen.scanner);
    notifyListeners();
  }

  void navigateToConfirmation() {
    _state = _state.copyWith(currentScreen: AppScreen.confirmation);
    notifyListeners();
  }

  void navigateToGetStarted() {
    _state = _state.copyWith(currentScreen: AppScreen.getStarted);
    notifyListeners();
  }

  void closeModal() {
    _state = _state.copyWith(currentScreen: AppScreen.getStarted);
    notifyListeners();
  }

  Future<void> startScanning() async {
    _state = _state.copyWith(isScanning: true);
    notifyListeners();

    // Simulate scanning delay
    await Future.delayed(Duration(seconds: 2));

    // Mock scanned data
    _state = _state.copyWith(
      isScanning: false,
      scannedData: 'ROOM-123-CHECK-IN',
    );
    notifyListeners();

    await Future.delayed(Duration(milliseconds: 500));

    _state = _state.copyWith(currentScreen: AppScreen.confirmation);
    notifyListeners();
  }

  void resetScan() {
    _state = _state.copyWith(scannedData: null, isScanning: false);
    notifyListeners();
  }

  void navigateToHome() {
    // This method can be called to navigate to the home screen
    // The actual navigation should be handled by the widget that has access to context
    _state = _state.copyWith(currentScreen: AppScreen.home);
    notifyListeners();
  }

  // Scanner-related methods
  void setScanning(bool isScanning) {
    _state = _state.copyWith(isScanning: isScanning);
    notifyListeners();
  }

  void setScannedData(String? data) {
    _state = _state.copyWith(scannedData: data);
    notifyListeners();
  }

  void triggerScanCompletion() {
    _state = _state.copyWith(currentScreen: AppScreen.confirmation);
    notifyListeners();
  }
}
