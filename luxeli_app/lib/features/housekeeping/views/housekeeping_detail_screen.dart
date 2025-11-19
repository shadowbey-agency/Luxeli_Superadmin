import 'package:flutter/material.dart';

class HousekeepingDetailScreen extends StatelessWidget {
  const HousekeepingDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final ValueNotifier<String> selectedCleaningType = ValueNotifier(
      'Full room',
    );
    final ValueNotifier<String> selectedTime = ValueNotifier('09:00am');

    final List<String> availableTimes = [
      '7:00am',
      '8:00am',
      '09:00am',
      '11:00am',
      '12:00pm',
    ];

    return Container(
      height: 476, // Exact height from design
      width: double.infinity,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(24),
          topRight: Radius.circular(24),
        ),
      ),
      padding: const EdgeInsets.fromLTRB(24, 24, 24, 32), // Exact padding
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                '15/09/2025',
                style: TextStyle(
                  fontSize: 22, // Exact font size
                  fontWeight: FontWeight.w700, // Bold
                  color: Color(0xFF333333), // Exact text color
                  height: 1.2,
                ),
              ),
              GestureDetector(
                onTap: () => Navigator.of(context).pop(),
                child: Container(
                  width: 28, // Exact size
                  height: 28, // Exact size
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5F5F5), // Light gray background
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: const Color(0xFFE0E0E0), // Border color
                      width: 1, // Border width
                    ),
                  ),
                  child: const Icon(
                    Icons.close,
                    color: Color(0xFF666666), // Icon color
                    size: 16, // Icon size
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24), // Exact spacing
          // Cleaning Type Section
          const Text(
            'Cleaning type',
            style: TextStyle(
              fontSize: 16, // Exact font size
              fontWeight: FontWeight.w600, // Semi-bold
              color: Color(0xFF333333), // Text color
              height: 1.25,
            ),
          ),
          const SizedBox(height: 12), // Exact spacing
          // Cleaning Type Cards
          ValueListenableBuilder<String>(
            valueListenable: selectedCleaningType,
            builder: (context, currentType, child) {
              return Row(
                children: [
                  _buildCleaningTypeCard(
                    icon: Icons.bed_outlined,
                    title: 'Full room',
                    isSelected: currentType == 'Full room',
                    onTap: () => selectedCleaningType.value = 'Full room',
                  ),
                  const SizedBox(width: 12), // Exact spacing
                  _buildCleaningTypeCard(
                    icon: Icons.auto_awesome_outlined,
                    title: 'Quick refresh',
                    isSelected: currentType == 'Quick refresh',
                    onTap: () => selectedCleaningType.value = 'Quick refresh',
                  ),
                  const SizedBox(width: 12), // Exact spacing
                  _buildCleaningTypeCard(
                    icon: Icons.tune,
                    title: 'Custom',
                    isSelected: currentType == 'Custom',
                    onTap: () => selectedCleaningType.value = 'Custom',
                  ),
                ],
              );
            },
          ),
          const SizedBox(height: 24), // Exact spacing
          // Time Selection Row
          Row(
            children: [
              const Icon(
                Icons.access_time,
                color: Color(0xFF666666), // Icon color
                size: 20, // Icon size
              ),
              const SizedBox(width: 8), // Exact spacing
              ValueListenableBuilder<String>(
                valueListenable: selectedTime,
                builder: (context, currentTime, child) {
                  return Container(
                    width: 96, // Exact width
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8F8F8), // Background color
                      borderRadius: BorderRadius.circular(8), // Border radius
                      border: Border.all(
                        color: const Color(0xFFE0E0E0), // Border color
                        width: 1,
                      ),
                    ),
                    child: Text(
                      currentTime,
                      style: const TextStyle(
                        fontSize: 14, // Font size
                        fontWeight: FontWeight.w500, // Medium
                        color: Color(0xFF333333), // Text color
                        height: 1.2,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  );
                },
              ),
              const SizedBox(width: 12), // Exact spacing
              const Icon(
                Icons.arrow_forward,
                color: Color(0xFF666666), // Icon color
                size: 16, // Icon size
              ),
              const SizedBox(width: 12), // Exact spacing
              Container(
                width: 96, // Exact width
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8F8F8), // Background color
                  borderRadius: BorderRadius.circular(8), // Border radius
                  border: Border.all(
                    color: const Color(0xFFE0E0E0), // Border color
                    width: 1,
                  ),
                ),
                child: const Text(
                  '09:30am',
                  style: TextStyle(
                    fontSize: 14, // Font size
                    fontWeight: FontWeight.w500, // Medium
                    color: Color(0xFF333333), // Text color
                    height: 1.2,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16), // Exact spacing
          // Time List
          ValueListenableBuilder<String>(
            valueListenable: selectedTime,
            builder: (context, currentTime, child) {
              return Container(
                height: 120, // Exact height
                decoration: BoxDecoration(
                  color: const Color(0xFFF8F8F8), // Background color
                  borderRadius: BorderRadius.circular(12), // Border radius
                  border: Border.all(
                    color: const Color(0xFFE0E0E0), // Border color
                    width: 1,
                  ),
                ),
                child: ListView.builder(
                  padding: EdgeInsets.zero,
                  itemCount: availableTimes.length,
                  itemBuilder: (context, index) {
                    final time = availableTimes[index];
                    final isSelected = time == currentTime;
                    return GestureDetector(
                      onTap: () => selectedTime.value = time,
                      child: Container(
                        height: 40, // Exact item height
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: isSelected
                              ? const Color(0xFFE8F4FF) // Selected blue
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          time,
                          style: TextStyle(
                            fontSize: 14, // Font size
                            fontWeight: isSelected
                                ? FontWeight.w600
                                : FontWeight.w400,
                            color: isSelected
                                ? const Color(0xFF007AFF) // Selected blue text
                                : const Color(0xFF333333), // Normal text color
                            height: 1.2,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              );
            },
          ),
          const SizedBox(height: 24), // Exact spacing
          // Confirm Button
          SizedBox(
            width: double.infinity,
            height: 48, // Exact button height
            child: ElevatedButton(
              onPressed: () {
                // Handle confirm action
                Navigator.of(context).pop();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0A3B78), // Button color
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(
                    12,
                  ), // Button border radius
                ),
                elevation: 0,
                shadowColor: Colors.transparent,
              ),
              child: const Text(
                'Confirm',
                style: TextStyle(
                  fontSize: 16, // Font size
                  fontWeight: FontWeight.w600, // Semi-bold
                  color: Colors.white,
                  height: 1.25,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCleaningTypeCard({
    required IconData icon,
    required String title,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          height: 88, // Exact card height
          padding: const EdgeInsets.symmetric(vertical: 12), // Exact padding
          decoration: BoxDecoration(
            color: isSelected
                ? const Color(0xFFE8F4FF)
                : const Color(0xFFF8F8F8),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected
                  ? const Color(0xFF007AFF)
                  : const Color(0xFFE0E0E0),
              width: isSelected ? 2 : 1,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Radio button
              Container(
                width: 16, // Radio button size
                height: 16, // Radio button size
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isSelected
                        ? const Color(0xFF007AFF)
                        : const Color(0xFF999999),
                    width: isSelected ? 5 : 2,
                  ),
                ),
              ),
              const SizedBox(height: 4), // Exact spacing
              Icon(
                icon,
                size: 20, // Icon size
                color: isSelected
                    ? const Color(0xFF007AFF)
                    : const Color(0xFF666666),
              ),
              const SizedBox(height: 4), // Exact spacing
              Text(
                title,
                style: TextStyle(
                  fontSize: 12, // Font size
                  fontWeight: FontWeight.w500, // Medium
                  color: isSelected
                      ? const Color(0xFF007AFF)
                      : const Color(0xFF333333),
                  height: 1.2,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Usage example:
// showModalBottomSheet(
//   context: context,
//   backgroundColor: Colors.transparent,
//   isScrollControlled: true,
//   builder: (context) => const CleaningRequestBottomSheet(),
// );
