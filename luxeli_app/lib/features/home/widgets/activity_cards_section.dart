import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/home_provider.dart';
import 'activity_card.dart';

class ActivityCardsSection extends StatelessWidget {
  const ActivityCardsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<HomeProvider>(
      builder: (context, provider, child) {
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                SizedBox(
                  width: 112,
                  child: ActivityCard(
                    label: 'Today\'s Activity',
                    isEmpty: provider.todayActivity.isEmpty,
                    emptyIcon: Icons.calendar_today_outlined,
                    emptyMessage: 'No activity\nplanned today',
                    child: provider.todayActivity.isEmpty
                        ? null
                        : Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                provider.todayActivity.title ?? '',
                                style: TextStyle(
                                  fontFamily: 'Fustat',
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.black,
                                ),
                                overflow: TextOverflow.ellipsis,
                                maxLines: 1,
                              ),
                              SizedBox(height: 2),
                              Text(
                                provider.todayActivity.subtitle ?? '',
                                style: TextStyle(
                                  fontFamily: 'Fustat',
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.black,
                                ),
                                overflow: TextOverflow.ellipsis,
                                maxLines: 1,
                              ),
                            ],
                          ),
                  ),
                ),

                SizedBox(width: 6),

                SizedBox(
                  width: 112, // Updated to match Figma width
                  child: ActivityCard(
                    label: 'Next cleaning',
                    sublabel: provider.nextCleaning.isEmpty
                        ? null
                        : 'Starts in',
                    isEmpty: provider.nextCleaning.isEmpty,
                    emptyIcon: Icons.cleaning_services_outlined,
                    emptyMessage: 'No cleaning\nscheduled yet',
                    child: provider.nextCleaning.isEmpty
                        ? null
                        : Row(
                            children: [
                              Flexible(
                                child: Text(
                                  provider.nextCleaning.time ?? '',
                                  style: TextStyle(
                                    fontFamily: 'Fustat',
                                    fontSize: 20,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.black,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              SizedBox(width: 4),
                              Text(
                                'Hours',
                                style: TextStyle(
                                  fontFamily: 'Fustat',
                                  fontSize: 10,
                                  fontWeight: FontWeight.w400,
                                  color: Colors.black.withValues(alpha: 0.6),
                                ),
                              ),
                            ],
                          ),
                  ),
                ),

                SizedBox(width: 6),

                // Your Food
                SizedBox(
                  width: 112, // Updated to match Figma width
                  child: ActivityCard(
                    label: 'Your Food',
                    isEmpty: provider.foodOrder.isEmpty,
                    emptyIcon: Icons.restaurant_outlined,
                    emptyMessage: 'No current\nfood orders',
                    child: provider.foodOrder.isEmpty
                        ? null
                        : Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                provider.foodOrder.status ?? '',
                                style: TextStyle(
                                  fontFamily: 'Fustat',
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.black,
                                ),
                                overflow: TextOverflow.ellipsis,
                                maxLines: 1,
                              ),
                              SizedBox(height: 2),
                              Text(
                                '${provider.foodOrder.itemCount ?? 0} Items',
                                style: TextStyle(
                                  fontFamily: 'Fustat',
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.black,
                                ),
                                overflow: TextOverflow.ellipsis,
                                maxLines: 1,
                              ),
                            ],
                          ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
