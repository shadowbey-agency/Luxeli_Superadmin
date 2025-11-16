import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../widgets/hotel_images_grid.dart';
import '../widgets/hotel_logo.dart';
import '../widgets/primary_button.dart';

class GetStartedScreen extends StatelessWidget {
  const GetStartedScreen({super.key});

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
                _buildContent(),
                Spacer(),
                _buildPrivacyText(),
                SizedBox(height: 20),
                _buildGetStartedButton(context),
                SizedBox(height: 10),
                _buildQRLoginButton(context),
                SizedBox(height: 20),
                SizedBox(height: 8),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContent() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 31),
      child: Column(
        children: [
          Text(
            'Manage Your\nStay in One Tap',
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

  Widget _buildPrivacyText() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 54),
      child: RichText(
        textAlign: TextAlign.center,
        text: TextSpan(
          style: TextStyle(
            fontFamily: 'Fustat',
            fontSize: 14,
            fontWeight: FontWeight.w400,
            color: Color(0xFF212121).withValues(alpha: 0.6),
            height: 1.4,
          ),
          children: [
            TextSpan(text: 'By continuing, you agree to our '),
            TextSpan(
              text: 'Privacy Policy',
              style: TextStyle(
                fontWeight: FontWeight.w500,
                color: Color(0xFF212121),
              ),
            ),
            TextSpan(text: ' and '),
            TextSpan(
              text: 'Terms of Service',
              style: TextStyle(
                fontWeight: FontWeight.w500,
                color: Color(0xFF212121),
              ),
            ),
            TextSpan(text: '.'),
          ],
        ),
      ),
    );
  }

  Widget _buildGetStartedButton(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: PrimaryButton(
        text: 'Get Started',
        onPressed: () {
          context.read<GetStartedScreenProvider>().navigateToConnection();
        },
      ),
    );
  }

  Widget _buildQRLoginButton(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: TextButton(
        onPressed: () {
          Navigator.of(context).pushNamed('/qr-scanner');
        },
        child: Text(
          'Login with QR Code',
          style: TextStyle(
            fontFamily: 'Fustat',
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: Colors.deepPurple,
          ),
        ),
      ),
    );
  }
}
