import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/housekeeping/providers/housekeeping_provider.dart';
import 'package:luxeli_app/features/housekeeping/widgets/cleaning_type_card.dart';
import 'package:luxeli_app/core/routes/app_routes.dart';
import 'package:luxeli_app/providers/guest_provider.dart';

class CleaningRequestModal extends StatelessWidget {
  const CleaningRequestModal({super.key});

  @override
  Widget build(BuildContext context) {
    final ValueNotifier<String> selectedCleaningType = ValueNotifier(
      'Full room',
    );
    final ValueNotifier<String> selectedTime = ValueNotifier('09:00 AM');

    final List<String> availableTimes = [
      '07:00 AM',
      '08:00 AM',
      '09:00 AM',
      '10:00 AM',
      '11:00 AM',
      '12:00 PM',
      '01:00 PM',
      '02:00 PM',
      '03:00 PM',
      '04:00 PM',
      '05:00 PM',
      '06:00 PM',
    ];

    void submitCleaningRequest() async {
      final guestProvider = Provider.of<GuestProvider>(context, listen: false);
      final token = guestProvider.guestData?.token;

      if (token == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Authentication error. Please login again.'),
            backgroundColor: Colors.red,
          ),
        );
        return;
      }
      final loadingSnackBar = SnackBar(
        content: const Row(
          children: [
            CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
            SizedBox(width: 16),
            Text('Submitting request...'),
          ],
        ),
        backgroundColor: Colors.blue,
      );

      ScaffoldMessenger.of(context).showSnackBar(loadingSnackBar);
      final success =
          await Provider.of<HousekeepingProvider>(
            context,
            listen: false,
          ).addRequest(
            type: 'custom cleaning',
            requestedFor: selectedTime.value,
            cleaningType: selectedCleaningType.value.toLowerCase().replaceAll(
              ' ',
              '_',
            ),
            notes: 'Requested for ${selectedTime.value}',
          );

      ScaffoldMessenger.of(context).hideCurrentSnackBar();

      if (success) {
        Navigator.of(context).pop();
        Navigator.of(context).pushNamed(AppRoutes.housekeeping);

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Request submitted successfully!'),
            duration: const Duration(seconds: 2),
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            margin: const EdgeInsets.all(16),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Failed to submit request. Please try again.'),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            margin: const EdgeInsets.all(16),
          ),
        );
      }
    }

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
                '15/09/2025',
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
          const SizedBox(height: 24),
          const Text(
            'Cleaning type',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Color(0xFF333333),
            ),
          ),
          const SizedBox(height: 12),
          ValueListenableBuilder<String>(
            valueListenable: selectedCleaningType,
            builder: (context, currentType, child) {
              return Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: CleaningTypeCard(
                      icon: Icons.bed,
                      title: 'Full room',
                      isSelected: currentType == 'Full room',
                      onTap: () => selectedCleaningType.value = 'Full room',
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: CleaningTypeCard(
                      icon: Icons.auto_awesome,
                      title: 'Quick refresh',
                      isSelected: currentType == 'Quick refresh',
                      onTap: () => selectedCleaningType.value = 'Quick refresh',
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: CleaningTypeCard(
                      icon: Icons.tune,
                      title: 'Custom',
                      isSelected: currentType == 'Custom',
                      onTap: () => selectedCleaningType.value = 'Custom',
                    ),
                  ),
                ],
              );
            },
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              const Icon(Icons.access_time, color: Color(0xFF757575)),
              const SizedBox(width: 8),
              ValueListenableBuilder<String>(
                valueListenable: selectedTime,
                builder: (context, currentTime, child) {
                  return Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 10,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF5F5F5),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFE0E0E0)),
                    ),
                    child: Text(
                      currentTime,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF333333),
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(width: 12),
              const Icon(Icons.arrow_forward, color: Color(0xFF757575)),
              const SizedBox(width: 12),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFFF5F5F5),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE0E0E0)),
                ),
                child: const Text(
                  '09:30 AM',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF333333),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ValueListenableBuilder<String>(
            valueListenable: selectedTime,
            builder: (context, currentTime, child) {
              return Container(
                height: 150,
                decoration: BoxDecoration(
                  color: const Color(0xFFF5F5F5),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE0E0E0)),
                ),
                child: ListView.builder(
                  itemCount: availableTimes.length,
                  itemBuilder: (context, index) {
                    final time = availableTimes[index];
                    final isSelected = time == currentTime;
                    return GestureDetector(
                      onTap: () => selectedTime.value = time,
                      child: Container(
                        alignment: Alignment.center,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? const Color(0xFFE3F2FD)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          time,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: isSelected
                                ? FontWeight.bold
                                : FontWeight.normal,
                            color: isSelected
                                ? const Color(0xFF2196F3)
                                : const Color(0xFF333333),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              );
            },
          ),
          const SizedBox(height: 24),
          Center(
            child: ElevatedButton(
              onPressed: submitCleaningRequest,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0A3B78),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: 40,
                  vertical: 16,
                ),
              ),
              child: const Text(
                'Confirm',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
