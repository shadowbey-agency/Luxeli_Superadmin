import 'package:flutter/material.dart';
import 'package:luxeli_app/features/housekeeping/models/housekeeping_item_model.dart';

class ItemDetailModal extends StatefulWidget {
  final HousekeepingItem item;
  final int initialQty;

  const ItemDetailModal({super.key, required this.item, this.initialQty = 1});

  @override
  State<ItemDetailModal> createState() => _ItemDetailModalState();
}

class _ItemDetailModalState extends State<ItemDetailModal> {
  late int qty;

  @override
  void initState() {
    super.initState();
    qty = widget.initialQty;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return SafeArea(
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(24),
            topRight: Radius.circular(24),
          ),
        ),
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                SizedBox(width: 44),
                Text(
                  widget.item.title,
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.close),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 180,
              width: double.infinity,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.network(
                  widget.item.imageUrl,
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
            const SizedBox(height: 12),
            Text(widget.item.description, style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 16),
            Row(
              children: [
                Text('Quantity', style: TextStyle(fontWeight: FontWeight.w600)),
                Spacer(),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      IconButton(
                        icon: Icon(Icons.remove),
                        onPressed: qty > 1 ? () => setState(() => qty--) : null,
                      ),
                      Text(
                        '$qty',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      IconButton(
                        icon: Icon(Icons.add),
                        onPressed: () => setState(() => qty++),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Center(
              child: ElevatedButton(
                onPressed: () => Navigator.of(context).pop(qty),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 36,
                    vertical: 14,
                  ),
                ),
                child: Text('Add to request'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
