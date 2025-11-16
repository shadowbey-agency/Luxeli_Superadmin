import 'package:flutter/material.dart';
import 'package:luxeli_app/features/get_started/model/app_state_model.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import 'get_started_screen.dart';
import 'connection_screen.dart';
import 'scanner_screen.dart';
import 'confirm_info_screen.dart';

class GetStartedMainScreen extends StatelessWidget {
  const GetStartedMainScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<GetStartedScreenProvider>(
      builder: (context, appProvider, child) {
        switch (appProvider.currentScreen) {
          case AppScreen.connection:
            return const ConnectionScreen();
          case AppScreen.scanner:
            return ScannerScreen();
          case AppScreen.confirmation:
            return const ConfirmInfoScreen();
          case AppScreen.home:
            WidgetsBinding.instance.addPostFrameCallback((_) {
              Navigator.of(context).pushReplacementNamed('/home');
            });
            return const Scaffold(
              body: Center(child: CircularProgressIndicator()),
            );
          default:
            return const GetStartedScreen();
        }
      },
    );
  }
}
