import 'package:flutter/foundation.dart';
import 'package:luxeli_app/features/qr_login/services/qr_login_service.dart';
import 'dart:io';
import 'dart:async';
import '../model/scan_result_model.dart';

class ScannerProvider extends ChangeNotifier {
  bool _isScanning = false;
  String? _errorMessage;
  ScanResult? _scanResult;
  bool _shouldNavigateToConfirmation = false;
  String? _rawScannedData; // Store the raw JSON data
  bool _isAuthenticating = false; // New flag for authentication state

  bool get isScanning => _isScanning;
  String? get errorMessage => _errorMessage;
  ScanResult? get scanResult => _scanResult;
  bool get shouldNavigateToConfirmation => _shouldNavigateToConfirmation;
  String? get rawScannedData => _rawScannedData; // Getter for raw data
  bool get isAuthenticating => _isAuthenticating; // Getter for auth state

  void setScanning(bool scanning) {
    _isScanning = scanning;
    _errorMessage = null;
    notifyListeners();
  }

  void setScannedData(String tokenData) {
    try {
      // Store the raw token data (JWT string or JSON data)
      _rawScannedData = tokenData;

      // For JWT tokens, we don't parse them as JSON
      // For JSON data, we'll make it available for parsing
      _errorMessage = null;
      _scanResult = null; // We don't have scan result data from JWT token
    } catch (e) {
      _errorMessage = 'Failed to process scan data: $e';
      _scanResult = null;
      _rawScannedData = null;
    }
    notifyListeners();
  }

  // New method to authenticate with QR code
  Future<void> authenticateWithQR() async {
    if (_rawScannedData == null) {
      _errorMessage = 'No scan data available';
      notifyListeners();
      return;
    }

    _isAuthenticating = true;
    _errorMessage = null;
    notifyListeners();

    try {
      // The raw scanned data should be a JWT token string
      final guestData = await QRLoginService.loginWithQR(_rawScannedData!);

      if (guestData != null) {
        // Authentication successful, trigger navigation to confirmation
        triggerScanCompletion();
      } else {
        _errorMessage = 'Authentication failed';
      }
    } on TimeoutException {
      _errorMessage =
          'Network timeout. Please check your connection and try again.';
    } on SocketException {
      _errorMessage =
          'Network error. Please make sure you are connected to the same WiFi network as the server and try again.';
    } catch (e) {
      String errorMessage = e.toString();
      if (errorMessage.contains('Connection refused')) {
        _errorMessage =
            'Unable to connect to server. Please make sure you are connected to the same WiFi network as the server and try again.';
      } else if (errorMessage.contains('Network')) {
        _errorMessage =
            'Network error. Please check your connection and try again.';
      } else {
        _errorMessage = 'Authentication failed: ${e.toString()}';
      }
    } finally {
      _isAuthenticating = false;
      notifyListeners();
    }
  }

  void triggerScanCompletion() {
    // For JWT tokens, we don't have a scanResult, but we do have rawScannedData
    if (_rawScannedData != null) {
      _shouldNavigateToConfirmation = true;
    } else {
      _errorMessage = _errorMessage ?? 'No valid scan data found';
    }
    _isScanning = false;
    notifyListeners();
  }

  void clearNavigationFlag() {
    _shouldNavigateToConfirmation = false;
    notifyListeners();
  }

  void retryScan() {
    _isScanning = false;
    _errorMessage = null;
    _scanResult = null;
    _shouldNavigateToConfirmation = false;
    _rawScannedData = null; // Clear raw data too
    _isAuthenticating = false; // Reset auth state
    notifyListeners();
  }

  // Method to get parsed data as a map
  Map<String, String>? getParsedData() {
    if (_rawScannedData == null) return null;

    try {
      // Check if this is JSON data (starts with {)
      if (_rawScannedData!.startsWith('{') && _rawScannedData!.endsWith('}')) {
        // Parse the JSON data and return as a map
        final dataMap = <String, String>{};

        // Remove the outer braces
        final content = _rawScannedData!.substring(
          1,
          _rawScannedData!.length - 1,
        );

        // Split by comma but be careful about commas in values
        final pairs = <String>[];
        var currentPair = '';
        var inQuotes = false;

        for (var i = 0; i < content.length; i++) {
          final char = content[i];

          if (char == '"' && (i == 0 || content[i - 1] != '\\')) {
            inQuotes = !inQuotes;
          }

          if (char == ',' && !inQuotes) {
            pairs.add(currentPair);
            currentPair = '';
          } else {
            currentPair += char;
          }
        }

        if (currentPair.isNotEmpty) {
          pairs.add(currentPair);
        }

        // Now parse each key-value pair
        for (final pair in pairs) {
          final colonIndex = pair.indexOf(':');
          if (colonIndex != -1) {
            var key = pair.substring(0, colonIndex).trim();
            var value = pair.substring(colonIndex + 1).trim();

            // Remove quotes if present
            if (key.startsWith('"') && key.endsWith('"')) {
              key = key.substring(1, key.length - 1);
            }
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.substring(1, value.length - 1);
            }

            dataMap[key] = value;
          }
        }

        return dataMap;
      } else {
        // This is a JWT token, not JSON data
        // Return default values since we can't parse a JWT token here
        return {
          'guestName': 'Unknown Guest',
          'guestPhone': 'Unknown',
          'roomName': 'Unknown Room',
          'checkInDate': 'Unknown',
          'checkOutDate': 'Unknown',
        };
      }
    } catch (e) {
      // Return default values if parsing fails
      return {
        'guestName': 'Unknown Guest',
        'guestPhone': 'Unknown',
        'roomName': 'Unknown Room',
        'checkInDate': 'Unknown',
        'checkOutDate': 'Unknown',
      };
    }
  }
}
