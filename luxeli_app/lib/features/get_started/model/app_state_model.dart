enum AppScreen { getStarted, connection, scanner, confirmation, home }

class AppStateModel {
  final AppScreen currentScreen;
  final bool isConnecting;
  final bool isScanning;
  final String? scannedData;

  AppStateModel({
    this.currentScreen = AppScreen.getStarted,
    this.isConnecting = false,
    this.isScanning = false,
    this.scannedData,
  });

  AppStateModel copyWith({
    AppScreen? currentScreen,
    bool? isConnecting,
    bool? isScanning,
    String? scannedData,
  }) {
    return AppStateModel(
      currentScreen: currentScreen ?? this.currentScreen,
      isConnecting: isConnecting ?? this.isConnecting,
      isScanning: isScanning ?? this.isScanning,
      scannedData: scannedData ?? this.scannedData,
    );
  }
}
