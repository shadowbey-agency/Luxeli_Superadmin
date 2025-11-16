import 'package:flutter/material.dart';
import 'package:luxeli_app/features/housekeeping/models/housekeeping_item_model.dart';
import 'package:luxeli_app/features/housekeeping/services/housekeeping_items_service.dart';

class HousekeepingItemsProvider with ChangeNotifier {
  List<HousekeepingItem> _items = [];
  bool _isLoading = false;
  String? _errorMessage;
  String? _token;

  List<HousekeepingItem> get items => _items;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  // Set the user token for API authentication
  void setToken(String token) {
    _token = token;
  }

  /// Fetch housekeeping items
  Future<void> fetchItems({String? category}) async {
    if (_token == null) return;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final fetchedItems = await HousekeepingItemsService.getHousekeepingItems(
        token: _token!,
        category: category,
      );

      if (fetchedItems != null) {
        _items = fetchedItems;
      } else {
        _errorMessage = 'Failed to load items';
      }
    } catch (e) {
      _errorMessage = 'Error loading items: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
