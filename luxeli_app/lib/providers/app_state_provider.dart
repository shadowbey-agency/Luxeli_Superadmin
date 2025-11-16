import 'package:flutter/material.dart';
import '../core/constants/app_config.dart';

class AppProvider with ChangeNotifier {
  final AppConfig _config;
  
  AppProvider(this._config);
  
  AppConfig get config => _config;
  
  String get appName => _config.appName;
  String get apiUrl => _config.apiUrl;
  bool get debugMode => _config.debugMode;
  String get environment => _config.environment;
}