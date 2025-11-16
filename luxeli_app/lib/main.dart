import 'package:flutter/material.dart';
import 'package:luxeli_app/core/app_widget.dart';
import 'package:provider/provider.dart';
import 'providers/app_provider.dart' as app_provider;
import 'core/constants/app_config.dart';

void main() {
  runApp(
    MultiProvider(
      providers: app_provider.AppMultiProvider.providers(AppConfig.dev),
      child: MyApp(),
    ),
  );
}
