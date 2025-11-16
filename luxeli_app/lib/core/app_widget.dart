import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state_provider.dart';
import '../providers/guest_provider.dart';
import '../core/routes/app_router.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    final appProvider = Provider.of<AppProvider>(context);

    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: appProvider),
        ChangeNotifierProvider(create: (_) => GuestProvider()),
      ],
      child: MaterialApp(
        title: appProvider.appName,
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          // This is the theme of your application.
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        ),
        initialRoute: '/',
        onGenerateRoute: AppRouter.generateRoute,
      ),
    );
  }
}
