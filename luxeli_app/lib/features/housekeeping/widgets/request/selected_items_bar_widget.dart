import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/housekeeping/providers/selected_items_provider.dart';

class SelectedItemsBarWidget extends StatelessWidget {
  final String serviceTitle;
  final VoidCallback onConfirmRequest;

  const SelectedItemsBarWidget({
    super.key,
    required this.serviceTitle,
    required this.onConfirmRequest,
  });

  @override
  Widget build(BuildContext context) {
    return Consumer<SelectedItemsProvider>(
      builder: (context, selectedItemsProvider, child) {
        final selectedCount = selectedItemsProvider.selectedCount;

        return Container(
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              Text(
                '$selectedCount Items selected',
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
              Spacer(),
              ElevatedButton(
                onPressed: selectedCount == 0 ? null : onConfirmRequest,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.indigo[900],
                  padding: const EdgeInsets.symmetric(
                    horizontal: 28,
                    vertical: 14,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Text('Request items'),
              ),
            ],
          ),
        );
      },
    );
  }
}
