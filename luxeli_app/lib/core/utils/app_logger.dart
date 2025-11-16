class AppLogger {
  static void log(String message) {
    // In a real app, you might want to use a proper logging package
    // For now, we'll just print to the console
    print('LOG: $message');
  }
  
  static void logError(String message) {
    print('ERROR: $message');
  }
  
  static void logWarning(String message) {
    print('WARNING: $message');
  }
  
  static void logInfo(String message) {
    print('INFO: $message');
  }
}