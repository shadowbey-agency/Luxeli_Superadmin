import 'package:flutter/material.dart';
import 'package:dotted_border/dotted_border.dart';
import 'package:luxeli_app/features/services/service_screen.dart';
import 'package:luxeli_app/features/housekeeping/views/housekeeping_screen.dart';
import 'package:luxeli_app/features/specials/views/specials_screen.dart';
import 'package:luxeli_app/features/bookings/views/booking_screen.dart';
import 'package:luxeli_app/features/activities/views/activities_screen.dart';
import 'package:luxeli_app/features/laundry/widgets/request/request_laundry_modal.dart';

class LatestServicesSection extends StatelessWidget {
  const LatestServicesSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Latest Services',
            style: TextStyle(
              fontFamily: 'Fustat',
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: Colors.black,
            ),
          ),
          SizedBox(height: 12),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            child: Row(
              children: [
                _buildServiceChip(
                  icon: Icons.cleaning_services_outlined,
                  label: 'Housekeeping',
                  isSelected: true,
                  isFullBorder: true, // First chip has full border
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => const HousekeepingScreen(
                          icon: Icons.cleaning_services_outlined,
                        ),
                      ),
                    );
                  },
                ),
                SizedBox(width: 12),
                _buildServiceChip(
                  icon: Icons.delivery_dining_outlined,
                  label: 'Delivery',
                  isSelected: false, // Not selected
                  isDottedBorder: true, // Dotted border
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => ServiceScreen(
                          title: 'Delivery',
                          subtitle: 'Send or receive items quickly and safely.',
                          icon: Icons.delivery_dining_outlined,
                        ),
                      ),
                    );
                  },
                ),
                SizedBox(width: 12),
                _buildServiceChip(
                  icon: Icons.local_laundry_service_outlined,
                  label: 'Laundry',
                  isSelected: false, // Not selected
                  isDottedBorder: true, // Dotted border
                  onTap: () {
                    showDialog(
                      context: context,
                      builder: (ctx) => const RequestLaundryModal(),
                    );
                  },
                ),
                _buildServiceChip(
                  icon: Icons.event_available_outlined,
                  label: 'Activities',
                  isSelected: false, // Not selected
                  isDottedBorder: true, // Dotted border
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => const ActivitiesScreen(),
                      ),
                    );
                  },
                ),
                _buildServiceChip(
                  icon: Icons.event_note_outlined,
                  label: 'Booking',
                  isSelected: false, // Not selected
                  isDottedBorder: true, // Dotted border
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => const BookingScreen(
                          image: 'assets/images/default_service.png',
                          name: 'Booking Service',
                          description: 'Book a service for your stay',
                          price: '0',
                        ),
                      ),
                    );
                  },
                ),
                _buildServiceChip(
                  icon: Icons.star_border,
                  label: 'Special',
                  isSelected: false,
                  isDottedBorder: true,
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const SpecialsScreen()),
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildServiceChip({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    bool isSelected = false,
    bool isFullBorder = false,
    bool isDottedBorder = false,
  }) {
    Widget content = Container(
      padding: EdgeInsets.symmetric(horizontal: 18, vertical: 10),
      decoration: BoxDecoration(
        color: isSelected ? Color(0xffe9eaec) : Color(0xffe9eaec),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.black),
          SizedBox(width: 8),
          Text(
            label,
            style: TextStyle(
              fontFamily: 'Fustat',
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Colors.black,
            ),
          ),
        ],
      ),
    );

    if (isFullBorder) {
      return GestureDetector(
        onTap: onTap,
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.black, width: 0.5),
          ),
          child: content,
        ),
      );
    } else if (isDottedBorder) {
      return GestureDetector(
        onTap: onTap,
        child: DottedBorder(
          color: Colors.black,
          strokeWidth: 0.4,
          dashPattern: [4, 4],
          borderType: BorderType.RRect,
          radius: Radius.circular(10),
          child: content,
        ),
      );
    } else {
      return GestureDetector(onTap: onTap, child: content);
    }
  }
}
