import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:luxeli_app/features/qr_login/services/qr_login_service.dart';
import 'package:luxeli_app/core/models/guest_model.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/providers/guest_provider.dart';
import 'package:luxeli_app/features/get_started/providers/scanner_provider.dart';
import 'package:permission_handler/permission_handler.dart';

class QRScannerScreen extends StatefulWidget {
  const QRScannerScreen({super.key});

  @override
  State<QRScannerScreen> createState() => _QRScannerScreenState();
}

class _QRScannerScreenState extends State<QRScannerScreen> {
  bool _isProcessing = false;
  MobileScannerController? _cameraController;
  bool _permissionsGranted = false;

  @override
  void initState() {
    super.initState();
    _requestCameraPermission();
  }

  Future<void> _requestCameraPermission() async {
    final status = await Permission.camera.request();
    setState(() {
      _permissionsGranted = status == PermissionStatus.granted;
    });

    if (_permissionsGranted) {
      _initializeScanner();
    }
  }

  void _initializeScanner() {
    _cameraController = MobileScannerController(
      detectionSpeed: DetectionSpeed.noDuplicates,
      torchEnabled: false,
      autoStart: true,
    );
  }

  @override
  void dispose() {
    _cameraController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan QR Code'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          if (!_permissionsGranted)
            Expanded(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Camera permission is required to scan QR codes',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 16),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: _requestCameraPermission,
                      child: const Text('Grant Permission'),
                    ),
                  ],
                ),
              ),
            )
          else
            Expanded(
              child: MobileScanner(
                controller: _cameraController,
                onDetect: (capture) {
                  if (_isProcessing) return;

                  _isProcessing = true;
                  final List<Barcode> barcodes = capture.barcodes;
                  for (final barcode in barcodes) {
                    if (barcode.rawValue != null) {
                      _handleQRCode(barcode.rawValue!);
                      break;
                    }
                  }
                },
              ),
            ),
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Position the QR code within the frame to scan',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
          ),
          // Add a button to toggle flashlight
          if (_permissionsGranted)
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: ElevatedButton(
                onPressed: () => _cameraController?.toggleTorch(),
                child: const Text('Toggle Flashlight'),
              ),
            ),
        ],
      ),
    );
  }

  Future<void> _handleQRCode(String qrCodeData) async {
    try {
      // Show loading indicator
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (BuildContext context) {
          return const Center(child: CircularProgressIndicator());
        },
      );

      // Check if the data looks like a data URL (starts with data:image)
      if (qrCodeData.startsWith('data:image')) {
        throw Exception(
          'QR code contains image data, not a token. Please scan a QR code that contains a login token.',
        );
      }

      // Check if the data looks like JSON
      if (qrCodeData.startsWith('{') && qrCodeData.endsWith('}')) {
        throw Exception(
          'QR code contains JSON data. Please scan a QR code that contains a login token.',
        );
      }

      // Trim whitespace from QR code data
      final trimmedData = qrCodeData.trim();

      // Validate that we have data
      if (trimmedData.isEmpty) {
        throw Exception(
          'Empty QR code scanned. Please try again with a valid QR code.',
        );
      }

      // Basic validation - JWT tokens should have 3 parts separated by dots
      final parts = trimmedData.split('.');

      if (parts.length != 3) {
        throw Exception(
          'Invalid QR code format. Please scan a valid QR code from the hotel system.',
        );
      }

      // Attempt to login with the QR code token
      final GuestData? guestData = await QRLoginService.loginWithQR(
        trimmedData,
      );

      // Hide loading indicator
      Navigator.of(context).pop();

      if (guestData != null) {
        // Store guest data in provider
        Provider.of<GuestProvider>(
          context,
          listen: false,
        ).setGuestData(guestData);

        // Also store the data in ScannerProvider for the ConfirmInfoScreen
        final scannerProvider = Provider.of<ScannerProvider>(
          context,
          listen: false,
        );

        // Create a JSON string with the guest data for the ConfirmInfoScreen
        final guestDataJson = {
          'guestName': guestData.guestName,
          'guestPhone': guestData.guestPhone ?? 'Not provided',
          'roomName': guestData.roomName,
          'checkInDate': guestData.checkInDate ?? 'Not provided',
          'checkOutDate': guestData.checkOutDate ?? 'Not provided',
        };

        // Convert to a format that can be parsed by getParsedData()
        final jsonString =
            '{${guestDataJson.entries.map((e) => '"${e.key}":"${e.value}"').join(',')}}';
        scannerProvider.setScannedData(jsonString);

        // Navigate to confirmation screen
        Navigator.of(context).pushReplacementNamed('/confirmation');

        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Login successful!'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        _showError('Login failed. Please try again.');
      }
    } catch (e) {
      // Hide loading indicator
      Navigator.of(context).pop();

      // Show more detailed error message
      String errorMessage = e.toString();

      if (errorMessage.startsWith('Exception: ')) {
        errorMessage = errorMessage.substring(
          11,
        ); // Remove 'Exception: ' prefix
      }

      // Provide more user-friendly error messages
      if (errorMessage.contains('JSON')) {
        errorMessage =
            'Invalid QR code format. Please scan a valid QR code from the hotel system.';
      } else if (errorMessage.contains('Connection refused') ||
          errorMessage.contains('Network')) {
        errorMessage =
            'Unable to connect to server. Please make sure you are connected to the same WiFi network as the server and try again.';
      } else if (errorMessage.contains('timeout')) {
        errorMessage =
            'Request timed out. Please check your internet connection and try again.';
      }

      _showError(errorMessage);
    } finally {
      _isProcessing = false;
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.red),
    );
  }
}
