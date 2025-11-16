import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../widgets/hotel_images_grid.dart';
import '../widgets/hotel_logo.dart';
import '../widgets/primary_button.dart';
import '../widgets/qr_icon.dart';

class ConnectionScreen extends StatelessWidget {
  const ConnectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          HotelImagesGrid(),
          SafeArea(
            bottom: false,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                SizedBox(height: 218),
                SizedBox(height: 35),
                HotelLogo(),
                SizedBox(height: 20),
                _buildBackgroundContent(),
              ],
            ),
          ),
          Positioned.fill(
            child: Container(color: Color(0xFF1F2A44).withValues(alpha: 0.6)),
          ),
          Positioned(
            left: 20,
            right: 20,
            top: 450,
            child: _buildModal(context),
          ),
        ],
      ),
    );
  }

  Widget _buildBackgroundContent() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 31),
      child: Column(
        children: [
          Text(
            'Manage Your Stay in One Tap',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: 'Fustat',
              fontSize: 38,
              fontWeight: FontWeight.w800,
              color: Colors.black,
              height: 1.32,
            ),
          ),
          SizedBox(height: 20),
          Text(
            'Your all-in-one hotel app for room services, bookings, and personalized experiences.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: 'Fustat',
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: Color(0xFF212121).withValues(alpha: 0.6),
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildModal(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(30),
      ),
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          SizedBox(height: 8),
          QrIcon(),
          SizedBox(height: 12),
          Text(
            'Scan your room QR',
            style: TextStyle(
              fontFamily: 'Fustat',
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: Colors.black,
              height: 1.39,
            ),
          ),
          SizedBox(height: 16),
          Text(
            'Scan the QR code placed in your room to start your check-in and access hotel services instantly.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: 'Fustat',
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: Color(0xFF212121).withValues(alpha: 0.6),
              height: 1.4,
            ),
          ),
          SizedBox(height: 28),
          PrimaryButton(
            text: 'Scan',
            onPressed: () {
              context.read<GetStartedScreenProvider>().navigateToScanner();
            },
            width: 318,
          ),
        ],
      ),
    );
  }
}
