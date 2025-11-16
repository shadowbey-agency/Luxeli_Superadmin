import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/core/constants/app_images.dart';
import '../providers/splash_provider.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Get the provider instance
    final splashProvider = Provider.of<SplashProvider>(context, listen: false);
    
    // Initialize app on first build
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initializeAndNavigate(context, splashProvider);
    });

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage(AppImages.splashBackground),
            fit: BoxFit.cover,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Logo
            Image.asset(
              AppImages.logo,
              width: 150,
              height: 150,
            ),
            SizedBox(height: 30),
            // Loading indicator
            Provider.of<SplashProvider>(context).isLoading
                ? CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  )
                : SizedBox(),
          ],
        ),
      ),
    );
  }

  void _initializeAndNavigate(BuildContext context, SplashProvider splashProvider) async {
    await splashProvider.initializeApp();
    if (context.mounted) {
      Navigator.pushReplacementNamed(context, '/language-selection');
    }
  }
}