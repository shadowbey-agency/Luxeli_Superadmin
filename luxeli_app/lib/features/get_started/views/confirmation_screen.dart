import 'package:flutter/material.dart';
import '../widgets/hotel_images_grid.dart';
import '../widgets/hotel_logo.dart';
import '../widgets/primary_button.dart';

class ConfirmationScreen extends StatelessWidget {
  const ConfirmationScreen({super.key});

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
                SizedBox(height: 218), // Height of HotelImagesGrid
                SizedBox(height: 65),
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
            top: 406,
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
        children: [
          SizedBox(height: 8),
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: Color(0xFF4CAF50),
              shape: BoxShape.circle,
            ),
            child: Icon(Icons.check, size: 50, color: Colors.white),
          ),

          SizedBox(height: 20),
          Text(
            'Check-in Successful!',
            style: TextStyle(
              fontFamily: 'Fustat',
              fontSize: 24,
              fontWeight: FontWeight.w700,
              color: Colors.black,
              height: 1.39,
            ),
          ),
          SizedBox(height: 16),
          Text(
            'You have been successfully checked in to your room. Enjoy your stay!',
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
            text: 'Continue to Home',
            onPressed: () {
              // Directly navigate to the home route instead of using the provider
              Navigator.of(context).pushReplacementNamed('/home');
            },
          ),
        ],
      ),
    );
  }
}
