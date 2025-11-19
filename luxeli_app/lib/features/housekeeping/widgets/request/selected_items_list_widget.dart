import 'package:flutter/material.dart';
import 'package:luxeli_app/features/housekeeping/models/housekeeping_item_model.dart';

class SelectedItemsListWidget extends StatelessWidget {
  final Map<String, int> selectedItems;
  final List<HousekeepingItem> allItems;

  const SelectedItemsListWidget({
    super.key,
    required this.selectedItems,
    required this.allItems,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Selected items', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          ...selectedItems.entries.map((entry) {
            final item = allItems.firstWhere((i) => i.id == entry.key);
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Row(
                children: [Text('${item.title} x${entry.value}'), Spacer()],
              ),
            );
          }),
        ],
      ),
    );
  }
}
