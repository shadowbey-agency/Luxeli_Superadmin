import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:permission_handler/permission_handler.dart';
import '../providers/app_provider.dart';
import '../providers/scanner_provider.dart';
import '../widgets/scanner_frame.dart';

class ScannerScreen extends StatefulWidget {
  const ScannerScreen({super.key});

  @override
  State<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen> {
  @override
  void initState() {
    super.initState();
    // Activate scanning immediately when screen loads
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      // Request camera permission first
      final status = await Permission.camera.request();
      if (status.isGranted) {
        final scannerProvider = context.read<ScannerProvider>();
        // Add a small delay to ensure the widget is properly mounted
        await Future.delayed(Duration(milliseconds: 300));
        scannerProvider.setScanning(true);
      } else {
        // Handle permission denied
        print('Camera permission denied');
        // Show error to user
      }
    });
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Consumer2<GetStartedScreenProvider, ScannerProvider>(
          builder: (context, appProvider, scannerProvider, child) {
            if (scannerProvider.shouldNavigateToConfirmation) {
              WidgetsBinding.instance.addPostFrameCallback((_) {
                scannerProvider.clearNavigationFlag();
                Navigator.of(context).pushReplacementNamed('/confirmation');
              });
            }

            return Stack(
              children: [
                // Camera view is always active
                _buildQRScannerOverlay(scannerProvider),

                // Scanner frame overlay (centered)
                Center(child: ScannerFrame()),

                // Top bar
                _buildTopBar(context),

                // Status information overlay (removed since we don't parse JWT tokens)

                // Error message overlay (positioned within the scanner frame)
                if (scannerProvider.errorMessage != null)
                  _buildErrorOverlay(scannerProvider),

                // Authentication loading overlay
                if (scannerProvider.isAuthenticating)
                  _buildAuthLoadingOverlay(),

                // Bottom section
                _buildBottomSection(),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildQRScannerOverlay(ScannerProvider scannerProvider) {
    return Positioned.fill(
      child: MobileScanner(
        fit: BoxFit.cover,
        onDetect: (capture) {
          // Only process if we're in scanning mode
          if (!scannerProvider.isScanning) return;

          final List<Barcode> barcodes = capture.barcodes;
          if (barcodes.isNotEmpty) {
            final String? code = barcodes.first.rawValue;
            if (code != null) {
              // Process the scanned data
              scannerProvider.setScannedData(code);

              // Authenticate with the QR code
              scannerProvider.authenticateWithQR();
            }
          }
        },
      ),
    );
  }

  // Widget _buildStatusOverlay(ScannerProvider scannerProvider) {
  //   final scanResult = scannerProvider.scanResult!;
  //   return Positioned(
  //     top: 100, // Adjusted positioning
  //     left: 40, // Adjusted positioning
  //     right: 40, // Adjusted positioning
  //     child: Container(
  //       padding: EdgeInsets.all(16),
  //       decoration: BoxDecoration(
  //         color: Colors.white70,
  //         borderRadius: BorderRadius.circular(12),
  //       ),
  //       child: Column(
  //         mainAxisSize: MainAxisSize.min,
  //         crossAxisAlignment: CrossAxisAlignment.start,
  //         children: [
  //           Text(
  //             'Scan Result',
  //             style: TextStyle(
  //               fontSize: 18,
  //               fontWeight: FontWeight.bold,
  //               color: Colors.black87,
  //             ),
  //           ),
  //           SizedBox(height: 8),
  //           Text(
  //             'Name: ${scanResult.userName}',
  //             style: TextStyle(fontSize: 16, color: Colors.black87),
  //           ),
  //           Text(
  //             'Phone: ${scanResult.phoneNumber}',
  //             style: TextStyle(fontSize: 16, color: Colors.black87),
  //           ),
  //           Text(
  //             'Room: ${scanResult.roomNumber}',
  //             style: TextStyle(fontSize: 16, color: Colors.black87),
  //           ),
  //           Text(
  //             'Check-in: ${scanResult.checkIn}',
  //             style: TextStyle(fontSize: 16, color: Colors.black87),
  //           ),
  //           Text(
  //             'Check-out: ${scanResult.checkOut}',
  //             style: TextStyle(fontSize: 16, color: Colors.black87),
  //           ),
  //         ],
  //       ),
  //     ),
  //   );
  // }

  Widget _buildErrorOverlay(ScannerProvider scannerProvider) {
    return Positioned(
      top: 100, // Adjusted positioning
      left: 40, // Adjusted positioning
      right: 40, // Adjusted positioning
      child: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.red.withOpacity(0.9),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.error, color: Colors.white, size: 24),
                SizedBox(width: 8),
                Text(
                  'Scan Error',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              scannerProvider.errorMessage!,
              style: TextStyle(fontSize: 16, color: Colors.white),
            ),
            SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () {
                    context.read<ScannerProvider>().retryScan();
                    // Re-enable scanning
                    WidgetsBinding.instance.addPostFrameCallback((_) {
                      final scannerProvider = context.read<ScannerProvider>();
                      scannerProvider.setScanning(true);
                    });
                  },
                  child: Text(
                    'Try Again',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAuthLoadingOverlay() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
            SizedBox(height: 16),
            Text(
              'Authenticating...',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopBar(BuildContext context) {
    return Positioned(
      top: 0,
      left: 0,
      right: 0,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(
            bottom: BorderSide(color: Color(0xFFE2E2E2), width: 1),
          ),
        ),
        child: Column(
          children: [
            Container(
              height: 14.56,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(30),
                  topRight: Radius.circular(30),
                ),
              ),
            ),
            Container(
              height: 45.76,
              padding: EdgeInsets.symmetric(horizontal: 24.96),
              child: Stack(
                children: [
                  Center(
                    child: Text(
                      'Scan',
                      style: TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomSection() {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: Color(0xFFE7E7E7), width: 1)),
        ),
        padding: EdgeInsets.fromLTRB(20, 16, 20, 8),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Please stand in a place with a clear light source.',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 16,
                fontWeight: FontWeight.w400,
                color: Color(0xFF212121).withValues(alpha: 0.6),
              ),
            ),
            SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}
