import 'package:flutter/material.dart';
import 'package:luxeli_app/features/housekeeping/widgets/common/request_option_card.dart';
import 'package:luxeli_app/features/housekeeping/widgets/request/cleaning_request_modal.dart';
import 'package:luxeli_app/features/housekeeping/widgets/request/items_needed_sheet.dart';

class AddRequestOptionsModal extends StatelessWidget {
  const AddRequestOptionsModal({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.all(Radius.circular(24)),
      ),
      padding: const EdgeInsets.fromLTRB(16, 12, 30, 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Spacer(),
              const Text(
                'Add new request',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF333333),
                ),
              ),
              const Spacer(),
              GestureDetector(
                onTap: () => Navigator.of(context).pop(),
                child: Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    color: const Color(0xFFfafafa),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: const Color(0xFFB0B0B0),
                      width: 1,
                    ),
                  ),
                  child: const Icon(
                    Icons.close,
                    color: Color(0xFF757575),
                    size: 15,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          const Text(
            'Tell us what kind of request you want to make.',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w400,
              color: Color(0xFF757575),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: RequestOptionCard(
                  icon: Icons.cleaning_services_outlined,
                  title: 'Custom cleaning',
                  onTap: () {
                    Navigator.of(context).pop();
                    showModalBottomSheet(
                      context: context,
                      backgroundColor: Colors.transparent,
                      isScrollControlled: true,
                      shape: const RoundedRectangleBorder(
                        borderRadius: BorderRadius.all(Radius.circular(24)),
                      ),
                      builder: (context) => Padding(
                        padding: const EdgeInsets.fromLTRB(16, 16, 16, 50),
                        child: Container(
                          decoration: const BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.all(Radius.circular(24)),
                          ),
                          child: const CleaningRequestModal(),
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: RequestOptionCard(
                  icon: Icons.format_list_bulleted, // Or Icons.menu
                  title: 'Items needed',
                  onTap: () {
                    Navigator.of(context).pop(); // Close the modal
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
