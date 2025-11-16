import 'package:flutter/material.dart';
import 'package:luxeli_app/providers/app_state_provider.dart';
import 'package:provider/provider.dart';
import 'features/splash/views/splash_screen.dart';
import 'features/splash/providers/splash_provider.dart';
import 'core/constants/app_config.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => AppProvider(AppConfig.prod),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    final appProvider = Provider.of<AppProvider>(context);
    
    return ChangeNotifierProvider(
      create: (context) => SplashProvider(),
      child: MaterialApp(
        title: appProvider.appName,
        debugShowCheckedModeBanner: appProvider.debugMode,
        theme: ThemeData(
          // This is the theme of your application.
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        ),
        home: SplashScreen(),
      ),
    );
  }
}