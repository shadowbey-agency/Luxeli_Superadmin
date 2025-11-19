import 'package:flutter/material.dart';
import 'package:luxeli_app/features/housekeeping/models/housekeeping_item_model.dart';

class SelectedItemsProvider with ChangeNotifier {
  final Map<String, int> _selectedItems = {}; // key: item id, value: quantity

  Map<String, int> get selectedItems => Map<String, int>.from(_selectedItems);

  int get selectedCount => _selectedItems.length;

  bool isSelected(String itemId) => _selectedItems.containsKey(itemId);

  int getQuantity(String itemId) => _selectedItems[itemId] ?? 0;

  void toggleItem(HousekeepingItem item) {
    if (_selectedItems.containsKey(item.id)) {
      _selectedItems.remove(item.id);
    } else {
      _selectedItems[item.id] = 1;
    }
    notifyListeners();
  }

  void setQuantity(String itemId, int quantity) {
    if (quantity <= 0) {
      _selectedItems.remove(itemId);
    } else {
      _selectedItems[itemId] = quantity;
    }
    notifyListeners();
  }

  void clearSelection() {
    _selectedItems.clear();
    notifyListeners();
  }

  List<HousekeepingItem> getSelectedItems(List<HousekeepingItem> allItems) {
    return allItems
        .where((item) => _selectedItems.containsKey(item.id))
        .toList();
  }
}
