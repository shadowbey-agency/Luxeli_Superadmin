import 'package:flutter/material.dart';
import 'package:luxeli_app/features/housekeeping/widgets/request/items_needed_sheet.dart';
import 'package:luxeli_app/features/housekeeping/widgets/request_option_card.dart';
import 'package:luxeli_app/features/housekeeping/widgets/cleaning_request_modal.dart';

class AddRequestOptionsModal extends StatelessWidget {
  const AddRequestOptionsModal({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(24),
          topRight: Radius.circular(24),
        ),
      ),
      padding: const EdgeInsets.fromLTRB(24, 24, 24, 32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Add new request',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF333333),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close, color: Color(0xFF757575)),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Text(
            'Tell us what kind of request you want to make.',
            style: TextStyle(fontSize: 15, color: Color(0xFF757575)),
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: RequestOptionCard(
                  icon: Icons
                      .cleaning_services_outlined, // Or Icons.shopping_bag_outlined
                  title: 'Custom cleaning',
                  onTap: () {
                    // Close the options modal then open the detailed cleaning request modal (bottom sheet)
                    Navigator.of(
                      context,
                    ).pop(); // Close the AddRequestOptionsModal
                    showModalBottomSheet(
                      context: context,
                      backgroundColor: Colors.transparent,
                      isScrollControlled: true,
                      builder: (context) => const CleaningRequestModal(),
                    );
                  },
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: RequestOptionCard(
                  icon: Icons.format_list_bulleted, // Or Icons.menu
                  title: 'Items needed',
                  onTap: () {
                    Navigator.of(context).pop(); // Close the modal
                    // Open the ItemsNeededSheet bottom sheet
                    showModalBottomSheet(
                      context: context,
                      backgroundColor: Colors.transparent,
                      isScrollControlled: true,
                      builder: (context) => HousekeepingItemsNeededSheet(
                        serviceTitle: 'Housekeeping',
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
