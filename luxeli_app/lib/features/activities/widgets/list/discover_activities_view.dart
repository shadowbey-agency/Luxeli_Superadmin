import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/activities/providers/activities_provider.dart';
import 'package:luxeli_app/features/activities/models/activity_model.dart';
import 'package:luxeli_app/features/activities/widgets/detail/activity_detail_modal.dart';
import 'package:luxeli_app/ui_components/widgets/png_icon.dart';

class DiscoverActivitiesView extends StatelessWidget {
  const DiscoverActivitiesView({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<ActivitiesProvider>(
      builder: (context, activitiesProvider, child) {
        final activities = activitiesProvider.activities;

        if (activities.isEmpty) {
          return const Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                PngIcon(
                  assetName: 'assets/images/icons/activityemptyicon.png',
                  width: 48,
                  height: 48,
                  fallbackIcon: Icons.local_activity,
                ),
                SizedBox(height: 12),
                Text(
                  'No activities available',
                  style: TextStyle(fontSize: 16, color: Color(0xFF9E9E9E)),
                ),
              ],
            ),
          );
        }

        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: GridView.builder(
            gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
              maxCrossAxisExtent: 200,
              childAspectRatio: 0.8,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
            ),
            itemCount: activities.length,
            itemBuilder: (context, index) {
              final activity = activities[index];
              return _buildActivityCard(context, activity);
            },
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            padding: const EdgeInsets.only(
              bottom: 20,
            ), // Add some bottom padding
          ),
        );
      },
    );
  }

  Widget _buildActivityCard(BuildContext context, Activity activity) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Activity Image
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
            child: activity.activityImage != null
                ? Image.network(
                    activity.activityImage!,
                    height: 100,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        height: 100,
                        color: const Color(0xFFE0E0E0),
                        child: const Icon(
                          Icons.image_not_supported,
                          color: Color(0xFF9E9E9E),
                        ),
                      );
                    },
                  )
                : Container(
                    height: 100,
                    color: const Color(0xFFE0E0E0),
                    child: const Icon(Icons.image, color: Color(0xFF9E9E9E)),
                  ),
          ),
          // Activity Content
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  activity.activityTitle,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  activity.activityDescription,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(color: Colors.grey, fontSize: 12),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (ctx) => ActivityDetailModal(
                          image: activity.activityImage ?? '',
                          name: activity.activityTitle,
                          description: activity.activityDescription,
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0A3B78),
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text(
                      'Join',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
