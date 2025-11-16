import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/activities/providers/activities_provider.dart';
import 'package:luxeli_app/features/activities/models/activity_model.dart';

class ActivitiesList extends StatelessWidget {
  const ActivitiesList({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<ActivitiesProvider>(
      builder: (context, activitiesProvider, child) {
        final activities = activitiesProvider.activities;
        if (activities.isEmpty) {
          return const Center(
            child: Text(
              'No activities available',
              style: TextStyle(fontSize: 16, color: Color(0xFF9E9E9E)),
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: activities.length,
          itemBuilder: (context, index) {
            final activity = activities[index];
            return _buildActivityCard(activity);
          },
        );
      },
    );
  }

  Widget _buildActivityCard(Activity activity) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE0E0E0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  activity.activityTitle,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF333333),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: _getStatusColor(activity.status),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    activity.status,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              activity.activityDescription,
              style: const TextStyle(fontSize: 14, color: Color(0xFF666666)),
            ),
            const SizedBox(height: 8),
            Text(
              'Created on: ${_formatDate(activity.createdAt)}',
              style: const TextStyle(fontSize: 12, color: Color(0xFF999999)),
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'published':
        return const Color(0xFF4CAF50);
      case 'unpublished':
        return const Color(0xFFF44336);
      default:
        return const Color(0xFF9E9E9E);
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}
