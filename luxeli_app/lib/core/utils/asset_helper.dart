class AssetHelper {
  /// Normalizes asset paths to prevent double "assets/" prefix
  static String normalizeAssetPath(String path) {
    // If the path already starts with "assets/", return it as is
    if (path.startsWith('assets/')) {
      return path;
    }
    
    // Otherwise, prepend "assets/" to the path
    return 'assets/$path';
  }
}