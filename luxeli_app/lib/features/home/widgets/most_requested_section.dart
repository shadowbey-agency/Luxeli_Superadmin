import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/home_provider.dart';
import '../models/activity_model.dart';
import 'service_item_card.dart';

class MostRequestedSection extends StatelessWidget {
  const MostRequestedSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(color: Color(0xFFFBFAFA)),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Most Requested Items',
              style: TextStyle(
                fontFamily: 'Fustat',
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: Colors.black,
              ),
            ),
            SizedBox(height: 2),
            Text(
              'See what guests request the most.',
              style: TextStyle(
                fontFamily: 'Fustat',
                fontSize: 12,
                fontWeight: FontWeight.w400,
                color: Colors.black.withValues(alpha: 0.6),
              ),
            ),
            SizedBox(height: 6),
            _buildCategoryTabs(),
            SizedBox(height: 6),
            _buildServiceItems(),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryTabs() {
    return Consumer<HomeProvider>(
      builder: (context, provider, child) {
        return Container(
          padding: EdgeInsets.all(6),
          decoration: BoxDecoration(
            color: Color(0xFFFBFAFA), 
            borderRadius: BorderRadius.circular(16), // Rounded corners
          ),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildCategoryTab(
                  context,
                  label: 'Bookings',
                  isSelected:
                      provider.selectedCategory == ServiceCategory.bookings,
                  onTap: () =>
                      provider.setSelectedCategory(ServiceCategory.bookings),
                ),
                SizedBox(width: 6),
                _buildCategoryTab(
                  context,
                  label: 'Housekeeping',
                  isSelected:
                      provider.selectedCategory == ServiceCategory.housekeeping,
                  onTap: () => provider.setSelectedCategory(
                    ServiceCategory.housekeeping,
                  ),
                ),
                SizedBox(width: 6),
                _buildCategoryTab(
                  context,
                  label: 'Activities',
                  isSelected:
                      provider.selectedCategory == ServiceCategory.activities,
                  onTap: () =>
                      provider.setSelectedCategory(ServiceCategory.activities),
                ),
                SizedBox(width: 6),
                _buildCategoryTab(
                  context,
                  label: 'On',
                  isSelected: false,
                  onTap: () {},
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildCategoryTab(
    BuildContext context, {
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 18, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? Color(0xffe9eaec) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected
                ? Colors.transparent
                : Colors.black.withValues(alpha: 0.1),
            width: 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.06),
                    blurRadius: 8,
                    offset: Offset(0, 2),
                  ),
                ]
              : null,
        ),
        child: Text(
          label,
          style: TextStyle(
            fontFamily: 'Fustat',
            fontSize: 14,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
            color: Colors.black,
          ),
        ),
      ),
    );
  }

  Widget _buildServiceItems() {
    return Consumer<HomeProvider>(
      builder: (context, provider, child) {
        return Row(
          children: provider.serviceItems.map((item) {
            return Expanded(
              child: Padding(
                padding: EdgeInsets.only(
                  right: item == provider.serviceItems.last ? 0 : 12,
                ),
                child: ServiceItemCard(item: item),
              ),
            );
          }).toList(),
        );
      },
    );
  }
}
