import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/housekeeping/models/housekeeping_item_model.dart';
import 'package:luxeli_app/features/housekeeping/providers/selected_items_provider.dart';
import 'package:luxeli_app/features/housekeeping/widgets/request/item_detail_modal.dart';

class ItemCardWidget extends StatelessWidget {
  final HousekeepingItem item;

  const ItemCardWidget({super.key, required this.item});

  @override
  Widget build(BuildContext context) {
    final selectedItemsProvider = Provider.of<SelectedItemsProvider>(context);
    final isSelected = selectedItemsProvider.isSelected(item.id);
    final quantity = selectedItemsProvider.getQuantity(item.id);

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [BoxShadow(color: Colors.black.withAlpha(8), blurRadius: 8)],
      ),
      child: Stack(
        children: [
          // Make the whole card tappable to open details
          InkWell(
            onTap: () async {
              // Open detail modal and wait for a quantity to be returned
              final result = await showModalBottomSheet<int>(
                context: context,
                isScrollControlled: true,
                backgroundColor: Colors.transparent,
                builder: (_) =>
                    ItemDetailModal(item: item, initialQty: quantity),
              );
              if (result != null && result > 0) {
                selectedItemsProvider.setQuantity(item.id, result);
              }
            },
            borderRadius: BorderRadius.circular(14),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Image area
                  SizedBox(
                    height: 100,
                    width: double.infinity,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.network(
                        item.imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            color: Colors.grey[300],
                            child: Icon(Icons.error, color: Colors.red),
                          );
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  // Category badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.blue.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      item.category,
                      style: const TextStyle(
                        color: Colors.blue,
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    item.title,
                    style: const TextStyle(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 6),
                  Expanded(
                    child: Text(
                      item.description,
                      style: const TextStyle(color: Colors.grey, fontSize: 12),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Add / count button
          Positioned(
            right: 12,
            bottom: 12,
            child: GestureDetector(
              onTap: () {
                selectedItemsProvider.toggleItem(item);
              },
              child: CircleAvatar(
                radius: 20,
                backgroundColor: isSelected ? Colors.blue : Colors.white,
                child: Icon(
                  isSelected ? Icons.check : Icons.add,
                  color: isSelected ? Colors.white : Colors.black,
                ),
              ),
            ),
          ),
          if (isSelected)
            Positioned(
              left: 12,
              bottom: 12,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: Text(
                  '$quantity x',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
